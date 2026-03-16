"use client";

import { Grid } from "@/lib/game";
import ShrineCell from "./ShrineCell";

interface ShrineGridProps {
  grid: Grid;
}

export default function ShrineGrid({ grid }: ShrineGridProps) {
  return (
    <div
      className="game-grid w-full max-w-sm mx-auto p-3 rounded-2xl"
      style={{
        background: "rgba(10,6,30,0.75)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(212,175,55,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.2)",
      }}
    >
      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <ShrineCell key={`${r}-${c}`} cell={cell} />
          ))
        )}
      </div>
    </div>
  );
}
