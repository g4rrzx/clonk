"use client";

import { useState } from "react";

const STORY_SLIDES = [
  {
    emoji: "🏭",
    title: "THE MACHINE AWAKENS",
    text: "Deep in the Base blockchain, an ancient machine has been discovered. It produces $CLONK tokens — but only for those who visit daily.",
  },
  {
    emoji: "🔨",
    title: "CLONK IT DAILY",
    text: "Hit the machine once every 24 hours. Each clonk mints tokens directly to your wallet. No middlemen. No BS.",
  },
  {
    emoji: "🔥",
    title: "BUILD YOUR STREAK",
    text: "Consecutive days = bigger rewards. 7-day streak gives 2x. 30-day streak gives 5x. Miss a day? Back to 1x.",
  },
  {
    emoji: "💰",
    title: "TRADE ANYTIME",
    text: "$CLONK is live on Uniswap. Stack it, trade it, hold it. Your tokens, your choice.",
  },
];

export function StoryIntro({ onComplete }: { onComplete: () => void }) {
  const [slide, setSlide] = useState(0);
  const current = STORY_SLIDES[slide];

  const next = () => {
    if (slide < STORY_SLIDES.length - 1) {
      setSlide(slide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="story-panel fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-100/95 backdrop-blur-sm">
      <div className="w-full max-w-sm">
        <div className="virus-card rounded-2xl p-6 text-center">
          <div className="text-6xl mb-4">{current.emoji}</div>
          <h2 className="text-xl font-black mb-3 tracking-wider text-primary">
            {current.title}
          </h2>
          <p className="text-base-content/80 text-sm leading-relaxed mb-6">
            {current.text}
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mb-4 justify-center">
            {STORY_SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-8 rounded-full transition-all ${
                  i <= slide ? "bg-primary" : "bg-base-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              className="btn btn-ghost btn-sm flex-1 text-base-content/40"
              onClick={onComplete}
            >
              Skip
            </button>
            <button className="btn btn-primary btn-sm flex-1" onClick={next}>
              {slide < STORY_SLIDES.length - 1 ? "Next →" : "Let's Clonk 🔨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
