"use client";

import Link from "next/link";
import { useMemo } from "react";

const OMIKUJI_DATA = [
  { rank: "大吉", emoji: "🌟", color: "#fcd34d", glow: "rgba(252,211,77,0.6)", message: "今日は神社マージで大連鎖を狙え！金運・縁結び 全て好調！", hint: "天照大神への道が開ける絶好の日" },
  { rank: "中吉", emoji: "🌸", color: "#86efac", glow: "rgba(134,239,172,0.4)", message: "良縁が訪れる日。積極的に合体を狙おう！", hint: "神宮・大社まで到達できる運気" },
  { rank: "小吉", emoji: "🌿", color: "#93c5fd", glow: "rgba(147,197,253,0.4)", message: "小さな幸せを積み重ねて。焦らず参拝を。", hint: "着実に合体を重ねて高みを目指そう" },
  { rank: "吉",   emoji: "☀️", color: "#fde68a", glow: "rgba(253,230,138,0.4)", message: "穏やかな運気。地道な努力が実を結ぶ日。", hint: "おみくじを引いて運気を上げよう" },
  { rank: "末吉", emoji: "🌧️", color: "#9ca3af", glow: "rgba(156,163,175,0.3)", message: "今日は慎重に。でもゲームは必ず好転する！", hint: "明日は大吉かも？毎日の参拝を続けよう" },
];

function getDailyOmikuji() {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  // 日付seedで決定論的に選択
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
          background: "linear-gradient(160deg, #1a0a00, #2d1800)",
          border: `2px solid ${omikuji.color}`,
          boxShadow: `0 0 20px ${omikuji.glow}`,
        }}
      >
        {/* 背景装飾 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${omikuji.glow} 0%, transparent 70%)`,
            opacity: 0.3,
          }}
        />
        <div className="relative z-10">
          <p className="text-xs font-bold mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>
            📅 {dateStr}の運勢
          </p>
          <div
            className="text-5xl mb-2"
            style={{ filter: `drop-shadow(0 0 12px ${omikuji.glow})` }}
          >
            {omikuji.emoji}
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
          <p className="text-sm text-amber-200 font-bold mb-1">{omikuji.message}</p>
          <p className="text-xs mb-4" style={{ color: "rgba(212,175,55,0.6)" }}>{omikuji.hint}</p>
          <Link
            href="/game"
            className="inline-block w-full py-3 rounded-xl font-black text-base transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${omikuji.color}, #d4af37)`,
              color: "#1a0a00",
              boxShadow: `0 0 16px ${omikuji.glow}`,
            }}
          >
            {omikuji.rank}を引いてゲームスタート →
          </Link>
          <p className="text-xs mt-2" style={{ color: "rgba(212,175,55,0.4)" }}>
            毎日更新 • ゲーム内で詳細なおみくじを引けます
          </p>
        </div>
      </div>
    </section>
  );
}
