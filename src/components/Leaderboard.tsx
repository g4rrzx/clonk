"use client";

// Mock leaderboard data - in production, fetch from API
const MOCK_LEADERS = [
  { rank: 1, name: "clonkmaster.eth", streak: 45, total: 22500 },
  { rank: 2, name: "0xdegen", streak: 38, total: 19000 },
  { rank: 3, name: "basebuilder", streak: 31, total: 15500 },
  { rank: 4, name: "farcaster.eth", streak: 28, total: 14000 },
  { rank: 5, name: "daily-grinder", streak: 21, total: 10500 },
  { rank: 6, name: "0xalpha", streak: 18, total: 9000 },
  { rank: 7, name: "tokenking", streak: 15, total: 7500 },
  { rank: 8, name: "basedchad", streak: 12, total: 6000 },
  { rank: 9, name: "clonker420", streak: 9, total: 4500 },
  { rank: 10, name: "newbie.eth", streak: 5, total: 2500 },
];

export function Leaderboard() {
  return (
    <div className="flex-1 p-4">
      <div className="max-w-sm mx-auto">
        <h2 className="text-lg font-black text-primary mb-4 tracking-wider">
          🏆 TOP CLONKERS
        </h2>

        <div className="space-y-2">
          {MOCK_LEADERS.map((user) => (
            <div
              key={user.rank}
              className={`virus-card rounded-xl px-4 py-3 flex items-center gap-3 ${
                user.rank <= 3 ? "border-primary/30" : ""
              }`}
            >
              <div className="text-lg font-black w-8 text-center">
                {user.rank === 1 && "🥇"}
                {user.rank === 2 && "🥈"}
                {user.rank === 3 && "🥉"}
                {user.rank > 3 && (
                  <span className="text-base-content/40 text-sm">#{user.rank}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-base-content/50">
                  {user.streak} day streak 🔥
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-secondary">
                  {user.total.toLocaleString()}
                </p>
                <p className="text-[10px] text-base-content/40">CLONK</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-base-content/30 mt-4">
          Updated every hour • Based on total claims
        </p>
      </div>
    </div>
  );
}
