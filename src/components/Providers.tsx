"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch {
        // Not in Farcaster context, still render
      }
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    return (
      <div className="h-dvh flex items-center justify-center bg-base-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🔨</div>
          <p className="text-base-content/60 text-sm">Warming up the machine...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#ff6b35",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
