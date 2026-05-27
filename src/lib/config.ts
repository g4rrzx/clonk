import { base } from "wagmi/chains";

export const CLONK_CONFIG = {
  // Will be set after deployment
  contractAddress: process.env.NEXT_PUBLIC_CLONK_CONTRACT as `0x${string}`,
  chainId: base.id,
  chain: base,

  // Token info
  name: "Clonk",
  symbol: "CLONK",
  decimals: 18,

  // Claim settings
  dailyBaseAmount: 100,
  cooldownHours: 24,
  streakBonus7: 2,
  streakBonus30: 5,

  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://clonk.vercel.app",
  appName: "The Daily Clonk Machine",
  appDescription: "Clonk it daily. Stack tokens. Trade on Uniswap.",
};

export const CLONK_ABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "canClaim",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "timeUntilClaim",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getClaimAmount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "users",
    outputs: [
      { name: "lastClaimTime", type: "uint256" },
      { name: "streak", type: "uint256" },
      { name: "totalClaimed", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
