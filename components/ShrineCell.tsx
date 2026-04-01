"use client";

import { Cell, SHRINES } from "@/lib/game";
import ShrineSvgIcon from "./ShrineSvgIcon";

// Level styles (gradient + glow + text color)
// glowColor: boxShadow のグロー色 / glowSize: px単位でレベルに比例して強くなる
const LEVEL_STYLES: Record<number, { bg: string; color: string; glow: string; glowSize: number; extra?: string }> = {
  1: { bg: "linear-gradient(135deg,rgba(45,27,78,0.92),#7c3aed)",   color: "#e9d5ff", glow: "#7c3aed", glowSize: 4 },
  2: { bg: "linear-gradient(135deg,rgba(13,58,45,0.92),#059669)",   color: "#a7f3d0", glow: "#059669", glowSize: 6 },
  3: { bg: "linear-gradient(135deg,rgba(45,27,0,0.92),#d97706)",    color: "#fde68a", glow: "#d97706", glowSize: 8 },
  4: { bg: "linear-gradient(135deg,rgba(13,45,74,0.92),#2563eb)",   color: "#bfdbfe", glow: "#2563eb", glowSize: 10 },
  5: { bg: "linear-gradient(135deg,rgba(74,0,37,0.92),#db2777)",    color: "#fbcfe8", glow: "#db2777", glowSize: 12 },
  6: { bg: "linear-gradient(135deg,rgba(13,45,58,0.92),#0891b2)",   color: "#a5f3fc", glow: "#0891b2", glowSize: 14 },
  7: { bg: "linear-gradient(135deg,rgba(60,20,0,0.92),#ea580c,#f59e0b)", color: "#fed7aa", glow: "#f59e0b", glowSize: 16 },
  8: { bg: "linear-gradient(135deg,#1a0a00,#d4af37,#fde68a)",        color: "#1a0a00", glow: "#FFD93D", glowSize: 20, extra: "cell-shine" },
  9: { bg: "linear-gradient(135deg,#1a0a00,#d4af37,#fffbeb)",        color: "#1a0a00", glow: "#FFD93D", glowSize: 28, extra: "cell-shine cell-float" },
};

interface ShrineCellProps {
  cell: Cell | null;
}

export default function ShrineCell({ cell }: ShrineCellProps) {
  if (!cell) {
    return (
      <div
        className="w-full aspect-square rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)" }}
      />
    );
  }

  const shrine = SHRINES[cell.level - 1];
  const style = LEVEL_STYLES[cell.level] ?? LEVEL_STYLES[1];
  const animClass = cell.isNew ? "cell-new" : cell.isMerged ? "cell-merged" : "";
  const extraClass = style.extra ?? "";

  // レベル連動グロー: glowSize に応じた強度・色で boxShadow を動的生成
  const glowHex = style.glow;
  const gs = style.glowSize;
  const dynamicBoxShadow = cell.level >= 8
    ? `0 0 ${gs}px ${Math.round(gs * 0.4)}px ${glowHex}cc, 0 2px 8px rgba(0,0,0,0.4)`
    : `0 0 ${gs}px ${Math.round(gs * 0.25)}px ${glowHex}66, 0 2px 6px rgba(0,0,0,0.4)`;

  return (
    <div
      className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center select-none ${animClass} ${extraClass}`}
      style={{
        background: style.bg,
        color: style.color,
        boxShadow: dynamicBoxShadow,
        border: cell.level >= 7 ? `1px solid ${glowHex}80` : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <ShrineSvgIcon level={cell.level} size={cell.level >= 7 ? 36 : 28} />
      <span className="text-[10px] sm:text-xs font-bold mt-0.5 leading-none">{shrine.name}</span>
      <span className="text-[9px] sm:text-[10px] opacity-75 leading-none">{shrine.score}</span>
    </div>
  );
}
