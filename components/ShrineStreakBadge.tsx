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
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm animate-pulse"
      style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(245,158,11,0.15))",
        border: "1px solid rgba(212,175,55,0.5)",
        color: "#fcd34d",
        boxShadow: "0 0 16px rgba(212,175,55,0.3)",
      }}
    >
       {streak}日連続参拝中！御利益UP中
    </div>
  );
}
