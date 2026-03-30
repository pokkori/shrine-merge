"use client";

import { Cell, SHRINES } from "@/lib/game";
import ShrineSvgIcon from "./ShrineSvgIcon";

// Level styles (gradient + text color)
const LEVEL_STYLES: Record<number, { bg: string; color: string; extra?: string }> = {
  1: { bg: "linear-gradient(135deg,#b91c1c,#ef4444)", color: "#fff" },
  2: { bg: "linear-gradient(135deg,#c2410c,#fb923c)", color: "#fff" },
  3: { bg: "linear-gradient(135deg,#b45309,#fbbf24)", color: "#1a0a00" },
  4: { bg: "linear-gradient(135deg,#15803d,#4ade80)", color: "#fff" },
  5: { bg: "linear-gradient(135deg,#0369a1,#38bdf8)", color: "#fff" },
  6: { bg: "linear-gradient(135deg,#6d28d9,#a78bfa)", color: "#fff" },
  7: { bg: "linear-gradient(135deg,#92400e,#f59e0b,#d97706)", color: "#fff" },
  8: { bg: "linear-gradient(135deg,#d4af37,#fde68a,#b8860b)", color: "#1a0a00", extra: "cell-shine" },
  9: { bg: "linear-gradient(135deg,#1a0a00,#d4af37,#fffbeb)", color: "#1a0a00", extra: "cell-shine cell-float" },
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

  return (
    <div
      className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center select-none ${animClass} ${extraClass}`}
      style={{
        background: style.bg,
        color: style.color,
        boxShadow: cell.level >= 8 ? "0 0 12px 3px rgba(212,175,55,0.6)" : "0 2px 8px rgba(0,0,0,0.4)",
        border: cell.level >= 7 ? "1px solid rgba(212,175,55,0.5)" : "none",
      }}
    >
      <ShrineSvgIcon level={cell.level} size={cell.level >= 7 ? 36 : 28} />
      <span className="text-[10px] sm:text-xs font-bold mt-0.5 leading-none">{shrine.name}</span>
      <span className="text-[9px] sm:text-[10px] opacity-75 leading-none">{shrine.score}</span>
    </div>
  );
}
