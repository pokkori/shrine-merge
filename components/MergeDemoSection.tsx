"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const DEMO_SEQUENCE = [
  { from: ["⛩️", "⛩️", null, null], merged: "🏯", label: "鳥居 × 鳥居 → 拝殿", color: "#c0392b" },
  { from: ["🏯", "🏯", null, null], merged: "🌳", label: "拝殿 × 拝殿 → 御神木", color: "#15803d" },
  { from: ["🌳", "🌳", null, null], merged: "🦊", label: "御神木 × 御神木 → 稲荷神社", color: "#0369a1" },
  { from: ["🦊", "🦊", null, null], merged: "⚡", label: "稲荷神社 × 稲荷神社 → 雷神社", color: "#6d28d9" },
  { from: ["⚡", "⚡", null, null], merged: "✨", label: "雷神社 × 雷神社 → 天照大神", color: "#d4af37" },
];

type Phase = "idle" | "highlight" | "merge" | "result";

export default function MergeDemoSection() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [autoPlay, setAutoPlay] = useState(true);

  const runMerge = useCallback(() => {
    setPhase("highlight");
    setTimeout(() => setPhase("merge"), 500);
    setTimeout(() => setPhase("result"), 900);
    setTimeout(() => {
      setPhase("idle");
      setStep((s) => (s + 1) % DEMO_SEQUENCE.length);
    }, 2200);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(runMerge, 1200);
    return () => clearTimeout(t);
  }, [step, autoPlay, runMerge]);

  const current = DEMO_SEQUENCE[step];
  const isHighlight = phase === "highlight";
  const isMerge = phase === "merge";
  const isResult = phase === "result";

  return (
    <section className="px-4 pb-10 max-w-sm mx-auto">
      <h2 className="text-center font-black text-amber-300 mb-2 text-lg">⚡ 合体の瞬間を体験</h2>
      <p className="text-center text-xs text-amber-500 mb-5">神社同士が合体して進化！ライブデモで確認</p>

      {/* Demo arena */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.25)",
          minHeight: "160px",
        }}
      >
        {/* Phase: highlight or merge */}
        {(phase === "idle" || isHighlight || isMerge) && (
          <div className="flex items-center justify-center gap-4">
            {/* Left cell */}
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-200"
              style={{
                background: isHighlight
                  ? `linear-gradient(135deg, ${current.color}cc, ${current.color})`
                  : "rgba(212,175,55,0.12)",
                border: isHighlight
                  ? `2px solid ${current.color}`
                  : "1px solid rgba(212,175,55,0.2)",
                transform: isMerge ? "translateX(20px) scale(0.8)" : isHighlight ? "scale(1.06)" : "scale(1)",
                opacity: isMerge ? 0 : 1,
                boxShadow: isHighlight ? `0 0 16px 4px ${current.color}88` : "none",
              }}
            >
              <span className="text-3xl">{current.from[0]}</span>
            </div>

            {/* Plus sign */}
            <span
              className="text-2xl font-black transition-all duration-200"
              style={{ color: isHighlight ? "#fcd34d" : "rgba(212,175,55,0.4)", opacity: isMerge ? 0 : 1 }}
            >
              +
            </span>

            {/* Right cell */}
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-200"
              style={{
                background: isHighlight
                  ? `linear-gradient(135deg, ${current.color}cc, ${current.color})`
                  : "rgba(212,175,55,0.12)",
                border: isHighlight
                  ? `2px solid ${current.color}`
                  : "1px solid rgba(212,175,55,0.2)",
                transform: isMerge ? "translateX(-20px) scale(0.8)" : isHighlight ? "scale(1.06)" : "scale(1)",
                opacity: isMerge ? 0 : 1,
                boxShadow: isHighlight ? `0 0 16px 4px ${current.color}88` : "none",
              }}
            >
              <span className="text-3xl">{current.from[1]}</span>
            </div>
          </div>
        )}

        {/* Phase: result — show merged cell */}
        {isResult && (
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center lp-demo-bounce"
              style={{
                background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                border: `2px solid ${current.color}`,
                boxShadow: `0 0 24px 8px ${current.color}88, 0 0 0 0 rgba(212,175,55,0)`,
              }}
            >
              <span className="text-4xl">{current.merged}</span>
            </div>
            <p
              className="text-sm font-black text-center animate-pulse"
              style={{ color: current.color === "#d4af37" ? "#fcd34d" : current.color }}
            >
              {current.label}
            </p>
          </div>
        )}

        {/* Label always visible when not result */}
        {!isResult && (
          <p className="text-center text-xs mt-3" style={{ color: "rgba(212,175,55,0.5)" }}>
            {current.label}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => {
            setAutoPlay(false);
            setPhase("idle");
            setStep((s) => (s === 0 ? DEMO_SEQUENCE.length - 1 : s - 1));
            setTimeout(() => setAutoPlay(true), 100);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
          style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: "#fcd34d" }}
        >
          ← 前
        </button>
        <span className="text-xs text-amber-600">
          {step + 1} / {DEMO_SEQUENCE.length}
        </span>
        <button
          onClick={() => {
            setAutoPlay(false);
            setPhase("idle");
            setStep((s) => (s + 1) % DEMO_SEQUENCE.length);
            setTimeout(() => setAutoPlay(true), 100);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
          style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: "#fcd34d" }}
        >
          次 →
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/game"
          className="btn-shrine-red inline-block px-10 py-3 text-base font-black"
        >
          自分で合体を体験する ⛩️
        </Link>
        <p className="text-xs text-amber-600 mt-2">全9段階の進化を自分の手で体験！</p>
      </div>
    </section>
  );
}
