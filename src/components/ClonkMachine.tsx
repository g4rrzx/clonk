"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useConnect, useReadContract, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import sdk from "@farcaster/frame-sdk";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { CLONK_ABI, CLONK_CONFIG } from "@/lib/config";

export function ClonkMachine() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { writeContractAsync } = useWriteContract();

  const [claiming, setClaiming] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

  // Get Farcaster context
  useEffect(() => {
    const getContext = async () => {
      const ctx = await sdk.context;
      if (ctx?.user) {
        setFid(ctx.user.fid);
        setUsername(ctx.user.username || "");
      }
    };
    getContext();
  }, []);

  // Auto-connect wallet
  useEffect(() => {
    if (!isConnected) {
      connect({ connector: farcasterFrame() });
    }
  }, [isConnected, connect]);

  // Read contract state
  const { data: canClaimData, refetch: refetchCanClaim } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "canClaim",
    args: address ? [address] : undefined,
  });

  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "users",
    args: address ? [address] : undefined,
  });

  const { data: claimAmount } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "getClaimAmount",
    args: address ? [address] : undefined,
  });

  const { data: balance } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: timeUntil } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "timeUntilClaim",
    args: address ? [address] : undefined,
  });

  // Countdown timer
  useEffect(() => {
    if (!timeUntil || timeUntil === 0n) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const seconds = Number(timeUntil);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      setCountdown(`${h}h ${m}m ${s}s`);
    };

    updateCountdown();
    const interval = setInterval(() => {
      refetchCanClaim();
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [timeUntil, refetchCanClaim]);

  const handleClaim = useCallback(async () => {
    if (!address || !canClaimData || claiming) return;

    setClaiming(true);
    try {
      // Get signature from backend
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, fid }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Claim failed");
      }

      const { amount, nonce, deadline, signature } = await res.json();

      // Send transaction
      await writeContractAsync({
        address: CLONK_CONFIG.contractAddress,
        abi: CLONK_ABI,
        functionName: "claim",
        args: [BigInt(amount), BigInt(nonce), BigInt(deadline), signature as `0x${string}`],
      });

      // Show coin animation
      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 1500);

      // Refresh data
      await Promise.all([refetchCanClaim(), refetchUser()]);
    } catch (err: any) {
      console.error("Claim error:", err);
      // Could show toast here
    } finally {
      setClaiming(false);
    }
  }, [address, canClaimData, claiming, fid, writeContractAsync, refetchCanClaim, refetchUser]);

  const canClaim = canClaimData === true;
  const streak = userData ? Number(userData[1]) : 0;
  const totalClaimed = userData ? formatEther(userData[2]) : "0";
  const currentBalance = balance ? formatEther(balance) : "0";
  const nextClaimAmount = claimAmount ? formatEther(claimAmount) : "100";

  return (
    <div className="h-dvh flex flex-col items-center justify-between py-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-clonk-accent">🔨 CLONK</h1>
        <p className="text-sm text-clonk-text/60 mt-1">The Daily Clonk Machine</p>
        {username && (
          <p className="text-xs text-clonk-text/40 mt-1">@{username}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        <div className="bg-clonk-card rounded-xl p-3 text-center">
          <p className="text-xs text-clonk-text/60">Balance</p>
          <p className="text-lg font-bold text-clonk-gold">
            {Number(currentBalance).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-clonk-card rounded-xl p-3 text-center">
          <p className="text-xs text-clonk-text/60">Streak</p>
          <p className="text-lg font-bold text-clonk-accent">{streak}🔥</p>
        </div>
        <div className="bg-clonk-card rounded-xl p-3 text-center">
          <p className="text-xs text-clonk-text/60">Next</p>
          <p className="text-lg font-bold text-clonk-text">
            {Number(nextClaimAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Clonk Button */}
      <div className="relative">
        {showCoin && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 coin-animation">
            <span className="text-3xl">🪙</span>
            <span className="text-clonk-gold font-bold ml-1">+{nextClaimAmount}</span>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={!canClaim || claiming}
          className={`clonk-button ${!canClaim || claiming ? "disabled" : ""}`}
        >
          <div className="text-center">
            {claiming ? (
              <div className="text-4xl animate-spin">⚙️</div>
            ) : canClaim ? (
              <>
                <div className="text-5xl">🔨</div>
                <p className="text-sm font-bold mt-2 text-white">CLONK IT</p>
              </>
            ) : (
              <>
                <div className="text-3xl">⏳</div>
                <p className="text-xs mt-2 text-white/60">{countdown}</p>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Streak info */}
      <div className="text-center space-y-2">
        {streak >= 7 && (
          <div className="streak-badge inline-block">
            {streak >= 30 ? "🏆 5x BONUS" : "⚡ 2x BONUS"}
          </div>
        )}
        <p className="text-xs text-clonk-text/40">
          Total claimed: {Number(totalClaimed).toLocaleString(undefined, { maximumFractionDigits: 0 })} CLONK
        </p>
        {CLONK_CONFIG.contractAddress && (
          <a
            href={`https://app.uniswap.org/swap?outputCurrency=${CLONK_CONFIG.contractAddress}&chain=base`}
            target="_blank"
            rel="noopener"
            className="text-xs text-clonk-accent underline"
          >
            Trade on Uniswap →
          </a>
        )}
      </div>
    </div>
  );
}
