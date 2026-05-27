import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const SIGNER_KEY = process.env.CLAIM_SIGNER_PRIVATE_KEY as `0x${string}`;
const CONTRACT = process.env.NEXT_PUBLIC_CLONK_CONTRACT as `0x${string}`;

// EIP-712 domain
const domain = {
  name: "ClonkToken",
  version: "1",
  chainId: 8453,
  verifyingContract: CONTRACT,
} as const;

const types = {
  Claim: [
    { name: "user", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

// Simple in-memory cooldown (use Redis in production)
const lastClaims = new Map<string, number>();
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

// Base claim amount
const BASE_AMOUNT = parseEther("100");

export async function POST(req: NextRequest) {
  try {
    const { address, fid } = await req.json();

    if (!address || !fid) {
      return NextResponse.json({ error: "Missing address or fid" }, { status: 400 });
    }

    // Check cooldown (server-side)
    const key = address.toLowerCase();
    const lastClaim = lastClaims.get(key) || 0;
    const now = Date.now();

    if (now - lastClaim < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (now - lastClaim)) / 1000);
      return NextResponse.json(
        { error: "Cooldown active", remainingSeconds: remaining },
        { status: 429 }
      );
    }

    // Generate claim signature
    const account = privateKeyToAccount(SIGNER_KEY);
    const nonce = BigInt(Date.now());
    const deadline = BigInt(Math.floor(now / 1000) + 3600); // 1 hour

    const signature = await account.signTypedData({
      domain,
      types,
      primaryType: "Claim",
      message: {
        user: address as `0x${string}`,
        amount: BASE_AMOUNT,
        nonce,
        deadline,
      },
    });

    // Record claim time
    lastClaims.set(key, now);

    return NextResponse.json({
      amount: BASE_AMOUNT.toString(),
      nonce: nonce.toString(),
      deadline: deadline.toString(),
      signature,
    });
  } catch (err: any) {
    console.error("Claim API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
