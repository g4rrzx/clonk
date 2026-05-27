"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { CLONK_ABI, CLONK_CONFIG } from "@/lib/config";

export function ClonkMachine() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [claiming, setClaiming] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [hitAnim, setHitAnim] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Read contract state
  const { data: canClaimData, refetch: refetchCanClaim } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "canClaim",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: userData, refetch: refetchUser } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "users",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: claimAmount } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "getClaimAmount",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: balance } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: timeUntil, refetch: refetchTime } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "timeUntilClaim",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Countdown timer
  useEffect(() => {
    if (!timeUntil || timeUntil === 0n) {
      setCountdown("");
      return;
    }

    const endTime = Date.now() + Number(timeUntil) * 1000;

    const update = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (remaining === 0) {
        setCountdown("");
        refetchCanClaim();
        return;
      }
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      setCountdown(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timeUntil, refetchCanClaim]);

  const handleClaim = useCallback(async () => {
    if (!address || !canClaimData || claiming) return;

    setClaiming(true);
    setHitAnim(true);
    setTimeout(() => setHitAnim(false), 300);

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Claim failed");
      }

      const { amount, nonce, deadline, signature } = await res.json();

      await writeContractAsync({
        address: CLONK_CONFIG.contractAddress,
        abi: CLONK_ABI,
        functionName: "claim",
        args: [BigInt(amount), BigInt(nonce), BigInt(deadline), signature as `0x${string}`],
      });

      setShowCoin(true);
      setTimeout(() => setShowCoin(false), 2000);

      await Promise.all([refetchCanClaim(), refetchUser(), refetchTime()]);
    } catch (err: any) {
      console.error("Claim error:", err);
    } finally {
      setClaiming(false);
    }
  }, [address, canClaimData, claiming, writeContractAsync, refetchCanClaim, refetchUser, refetchTime]);

  const canClaim = canClaimData === true;
  const streak = userData ? Number(userData[1]) : 0;
  const totalClaimed = userData ? formatEther(userData[2]) : "0";
  const currentBalance = balance ? formatEther(balance) : "0";
  const nextClaimAmount = claimAmount ? formatEther(claimAmount) : "100";

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🔨</div>
          <h2 className="text-xl font-black text-primary mb-2">Connect to Clonk</h2>
          <p className="text-base-content/60 text-sm">
            Connect your wallet to start clonking daily
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-6 px-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        <div className="stat-card">
          <p className="text-[10px] uppercase tracking-wider text-base-content/50 mb-1">Balance</p>
          <p className="text-lg font-black text-secondary">
            {Number(currentBalance).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-[10px] uppercase tracking-wider text-base-content/50 mb-1">Streak</p>
          <p className="text-lg font-black text-primary">
            {streak} <span className="text-sm">🔥</span>
          </p>
        </div>
        <div className="stat-card">
          <p className="text-[10px] uppercase tracking-wider text-base-content/50 mb-1">Next Claim</p>
          <p className="text-lg font-black text-base-content">
            {Number(nextClaimAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Clonk Button Area */}
      <div className="relative flex flex-col items-center">
        {/* Coin animation */}
        {showCoin && (
          <div className="absolute -top-16 animate-coin-drop flex items-center gap-1">
            <span className="text-3xl">🪙</span>
            <span className="text-secondary font-black text-lg">+{Number(nextClaimAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        )}

        {/* The Button */}
        <button
          onClick={handleClaim}
          disabled={!canClaim || claiming}
          className={`clonk-button ${!canClaim || claiming ? "disabled" : "animate-pulse-glow"} ${hitAnim ? "animate-clonk-hit" : ""}`}
        >
          <div className="text-center">
            {claiming ? (
              <span className="loading loading-spinner loading-lg text-white"></span>
            ) : canClaim ? (
              <>
                <div className="text-5xl">🔨</div>
                <p className="text-sm font-black mt-2 text-white/90 tracking-wider">CLONK IT</p>
              </>
            ) : (
              <>
                <div className="text-3xl mb-1">⏳</div>
                <p className="text-lg font-mono font-bold text-white/80">{countdown}</p>
              </>
            )}
          </div>
        </button>

        {/* Streak bonus indicator */}
        {streak >= 7 && (
          <div className="mt-4">
            <span className="streak-badge">
              {streak >= 30 ? "🏆 5x MEGA BONUS" : "⚡ 2x STREAK BONUS"}
            </span>
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="text-center space-y-1">
        <p className="text-xs text-base-content/40">
          Total claimed: {Number(totalClaimed).toLocaleString(undefined, { maximumFractionDigits: 0 })} CLONK
        </p>
        {CLONK_CONFIG.contractAddress && (
          <a
            href={`https://app.uniswap.org/swap?outputCurrency=${CLONK_CONFIG.contractAddress}&chain=base`}
            target="_blank"
            rel="noopener"
            className="text-xs text-primary hover:underline"
          >
            Trade on Uniswap →
          </a>
        )}
      </div>
    </div>
  );
}
