"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CLONK_ABI, CLONK_CONFIG } from "@/lib/config";

export function TokenInfo() {
  const { data: totalSupply } = useReadContract({
    address: CLONK_CONFIG.contractAddress,
    abi: CLONK_ABI,
    functionName: "totalSupply",
  });

  const supply = totalSupply ? formatEther(totalSupply) : "0";
  const maxSupply = 1_000_000_000;
  const minted = Number(supply);
  const percentage = ((minted / maxSupply) * 100).toFixed(2);

  return (
    <div className="flex-1 p-4">
      <div className="max-w-sm mx-auto space-y-4">
        <h2 className="text-lg font-black text-primary tracking-wider">
          🪙 $CLONK TOKEN
        </h2>

        {/* Token Stats */}
        <div className="virus-card rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Network</span>
            <span className="text-sm font-bold">Base</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Max Supply</span>
            <span className="text-sm font-bold">1,000,000,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Minted</span>
            <span className="text-sm font-bold text-secondary">
              {Number(minted).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div>
            <div className="flex justify-between text-xs text-base-content/50 mb-1">
              <span>Supply Minted</span>
              <span>{percentage}%</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={minted}
              max={maxSupply}
            />
          </div>
        </div>

        {/* Tokenomics */}
        <div className="virus-card rounded-2xl p-5">
          <h3 className="text-sm font-black mb-3 text-primary">TOKENOMICS</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Daily Claims</span>
              <span className="font-bold">40%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">DEX Liquidity (locked)</span>
              <span className="font-bold">20%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Community & Airdrops</span>
              <span className="font-bold">20%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Team</span>
              <span className="font-bold">10%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Reserve</span>
              <span className="font-bold">10%</span>
            </div>
          </div>
        </div>

        {/* Claim Rewards */}
        <div className="virus-card rounded-2xl p-5">
          <h3 className="text-sm font-black mb-3 text-primary">DAILY REWARDS</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Base claim</span>
              <span className="font-bold">100 CLONK</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">7-day streak</span>
              <span className="font-bold text-primary">200 CLONK (2x)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">30-day streak</span>
              <span className="font-bold text-secondary">500 CLONK (5x)</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {CLONK_CONFIG.contractAddress && (
            <>
              <a
                href={`https://basescan.org/token/${CLONK_CONFIG.contractAddress}`}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost btn-sm flex-1 text-xs"
              >
                Basescan ↗
              </a>
              <a
                href={`https://app.uniswap.org/swap?outputCurrency=${CLONK_CONFIG.contractAddress}&chain=base`}
                target="_blank"
                rel="noopener"
                className="btn btn-primary btn-sm flex-1 text-xs"
              >
                Trade ↗
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
