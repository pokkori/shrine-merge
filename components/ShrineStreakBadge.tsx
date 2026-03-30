"use client";

import { useEffect, useState } from "react";

function getShrineStreak(): number {
  try {
    const data = JSON.parse(localStorage.getItem("shrine_streak") ?? "{}");
    if (!data.streak || !data.lastDate) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (data.lastDate === today || data.lastDate === yesterday) return data.streak as number;
    return 0;
  } catch {
    return 0;
  }
}

/* Flame SVG icon */
function FlameSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2c0 4-4 6-4 10a6 6 0 0012 0c0-4-4-6-4-10-1 2-3 3-4 0z" fill="#fcd34d" />
      <path d="M12 8c0 2-2 3-2 5a3 3 0 006 0c0-2-2-3-2-5-.5 1-1.5 1.5-2 0z" fill="#f59e0b" />
    </svg>
  );
}

export default function ShrineStreakBadge() {
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStreak(getShrineStreak());
    setMounted(true);
  }, []);

  if (!mounted || streak < 2) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm animate-pulse min-h-[44px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fcd34d",
        boxShadow: "0 0 16px rgba(212,175,55,0.3)",
      }}
    >
      <FlameSvg /> {streak}日連続参拝中! 御利益UP中
    </div>
  );
}
