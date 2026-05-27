import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clonk.vercel.app";

export const metadata: Metadata = {
  title: "CLONK - The Daily Clonk Machine",
  description: "Clonk the machine daily. Stack $CLONK tokens. Trade on Uniswap.",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/api/og`,
      button: {
        title: "🔨 Clonk It",
        action: {
          url: APP_URL,
          type: "launch_miniapp",
          name: "CLONK",
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#0a0a0f",
        },
      },
    }),
    "og:title": "CLONK - The Daily Clonk Machine",
    "og:description": "Clonk the machine daily. Stack $CLONK tokens. Trade on Uniswap.",
    "og:image": `${APP_URL}/api/og`,
    "twitter:card": "summary_large_image",
    "twitter:title": "CLONK - The Daily Clonk Machine",
    "twitter:image": `${APP_URL}/api/og`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="clonk">
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
