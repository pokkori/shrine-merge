"use client";

import Link from "next/link";
import { useMemo } from "react";

/* SVG icon for fortune result */
function OmikujiSvg({ rank, color }: { rank: string; color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="18" y="4" width="28" height="56" rx="4" fill={color} opacity="0.2" />
      <rect x="22" y="8" width="20" height="48" rx="3" fill={color} opacity="0.35" />
      <text x="32" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color}>{rank}</text>
      <line x1="32" y1="8" x2="32" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const OMIKUJI_DATA = [
  { rank: "大吉", color: "#fcd34d", glow: "rgba(252,211,77,0.6)", message: "今日は神社マージで大連鎖を狙え! 金運・縁結び 全て好調!", hint: "天照大神への道が開ける絶好の日" },
  { rank: "中吉", color: "#86efac", glow: "rgba(134,239,172,0.4)", message: "良縁が訪れる日。積極的に合体を狙おう!", hint: "神宮・大社まで到達できる運気" },
  { rank: "小吉", color: "#93c5fd", glow: "rgba(147,197,253,0.4)", message: "小さな幸せを積み重ねて。焦らず参拝を。", hint: "着実に合体を重ねて高みを目指そう" },
  { rank: "吉",   color: "#fde68a", glow: "rgba(253,230,138,0.4)", message: "穏やかな運気。地道な努力が実を結ぶ日。", hint: "おみくじを引いて運気を上げよう" },
  { rank: "末吉", color: "#9ca3af", glow: "rgba(156,163,175,0.3)", message: "今日は慎重に。でもゲームは必ず好転する!", hint: "明日は大吉かも? 毎日の参拝を続けよう" },
];

function getDailyOmikuji() {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const idx = seed % OMIKUJI_DATA.length;
  return OMIKUJI_DATA[idx];
}

export default function DailyOmikujiTeaser() {
  const omikuji = useMemo(() => getDailyOmikuji(), []);
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <section className="px-4 pb-8 max-w-sm mx-auto">
      <div
        className="rounded-2xl p-5 text-center relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          border: `2px solid ${omikuji.color}`,
          boxShadow: `0 0 20px ${omikuji.glow}`,
        }}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${omikuji.glow} 0%, transparent 70%)`,
            opacity: 0.3,
          }}
        />
        <div className="relative z-10">
          <p className="text-xs font-bold mb-2 text-slate-300">
            {dateStr}の運勢
          </p>
          <div className="flex justify-center mb-2" style={{ filter: `drop-shadow(0 0 12px ${omikuji.glow})` }}>
            <OmikujiSvg rank={omikuji.rank.charAt(0)} color={omikuji.color} />
          </div>
          <div
            className="text-4xl font-black mb-3"
            style={{
              color: omikuji.color,
              textShadow: `0 0 20px ${omikuji.glow}`,
            }}
          >
            {omikuji.rank}
          </div>
          <p className="text-sm text-slate-200 font-bold mb-1">{omikuji.message}</p>
          <p className="text-xs mb-4 text-slate-400">{omikuji.hint}</p>
          <Link
            href="/game"
            className="inline-block w-full py-3 rounded-xl font-black text-base transition-all active:scale-[0.97] min-h-[44px]"
            style={{
              background: `linear-gradient(135deg, ${omikuji.color}, #d4af37)`,
              color: "#1a0a00",
              boxShadow: `0 0 16px ${omikuji.glow}`,
            }}
          >
            {omikuji.rank}を引いてゲームスタート
          </Link>
          <p className="text-xs mt-2 text-slate-500">
            毎日更新 -- ゲーム内で詳細なおみくじを引けます
          </p>
        </div>
      </div>
    </section>
  );
}
