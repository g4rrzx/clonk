import { NextRequest, NextResponse } from "next/server";

// Webhook for Farcaster notifications
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Handle frame added/removed events
    console.log("Webhook event:", body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
