import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🔨</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ff6b35",
            letterSpacing: "0.1em",
          }}
        >
          CLONK
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#e0e0e0",
            marginTop: 16,
            opacity: 0.8,
          }}
        >
          The Daily Clonk Machine
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#ffd700",
            marginTop: 24,
            padding: "8px 24px",
            borderRadius: 999,
            border: "2px solid #ffd700",
          }}
        >
          Claim 100 $CLONK Daily • Trade on Uniswap
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
