"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    return (
      <div className="h-dvh flex items-center justify-center bg-clonk-bg">
        <div className="text-center">
          <div className="text-4xl mb-4">🔨</div>
          <p className="text-clonk-text/60">Loading Clonk Machine...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
