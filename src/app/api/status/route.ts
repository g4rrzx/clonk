import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  // Return basic status (contract reads happen client-side via wagmi)
  return NextResponse.json({
    token: "CLONK",
    contract: process.env.NEXT_PUBLIC_CLONK_CONTRACT,
    chain: "base",
    chainId: 8453,
  });
}
