import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLONK - The Daily Clonk Machine",
  description: "Clonk it daily. Stack tokens. Trade on Uniswap.",
  other: {
    "fc:frame": "mini-app",
    "fc:frame:image": `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:title": "🔨 Clonk It",
    "fc:frame:button:action:type": "launch_frame",
    "fc:frame:button:action:url": process.env.NEXT_PUBLIC_APP_URL || "",
    "og:image": `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
    "og:title": "CLONK - The Daily Clonk Machine",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
