"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ClonkMachine } from "./ClonkMachine";
import { StoryIntro } from "./StoryIntro";
import { Leaderboard } from "./Leaderboard";
import { TokenInfo } from "./TokenInfo";

type Tab = "home" | "leaderboard" | "token";

export function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const [showStory, setShowStory] = useState(true);

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Story Intro Overlay */}
      {showStory && <StoryIntro onComplete={() => setShowStory(false)} />}

      {/* Header */}
      <div className="sticky top-0 z-20 bg-base-100 border-b border-base-300/30 px-4 py-2 flex items-center justify-between">
        <a className="flex items-center gap-2" href="/">
          <span className="text-2xl">🔨</span>
          <span className="font-black text-primary tracking-wider text-sm">
            CLONK
          </span>
        </a>
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
            if (!mounted || !account || !chain) {
              return (
                <button className="btn btn-primary btn-sm" onClick={openConnectModal}>
                  Connect Wallet
                </button>
              );
            }
            return (
              <button className="btn btn-ghost btn-sm" onClick={openAccountModal}>
                {account.displayName}
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>

      {/* Main Content */}
      <main className="relative flex flex-col flex-1 pb-20">
        {tab === "home" && <ClonkMachine />}
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "token" && <TokenInfo />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300/30">
        <div className="h-16 flex items-center justify-around px-2">
          <button
            onClick={() => setTab("home")}
            className={`bottom-nav-item ${tab === "home" ? "active" : ""}`}
          >
            <span className="text-xl">🔨</span>
            <span className="text-xs font-bold">Clonk</span>
          </button>
          <button
            onClick={() => setTab("leaderboard")}
            className={`bottom-nav-item ${tab === "leaderboard" ? "active" : ""}`}
          >
            <span className="text-xl">🏆</span>
            <span className="text-xs font-bold">Board</span>
          </button>
          <button
            onClick={() => setTab("token")}
            className={`bottom-nav-item ${tab === "token" ? "active" : ""}`}
          >
            <span className="text-xl">🪙</span>
            <span className="text-xs font-bold">$CLONK</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
