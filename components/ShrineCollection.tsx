"use client";

import { useEffect, useState } from "react";
import { SHRINES } from "@/lib/game";

const COLLECTION_KEY = "shrine_collection_unlocked";

export function unlockShrine(level: number): void {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem(COLLECTION_KEY) ?? "[]") as number[];
    if (!existing.includes(level)) {
      existing.push(level);
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(existing));
    }
  } catch { /* */ }
}

export function getUnlockedShrines(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(COLLECTION_KEY) ?? "[]") as number[];
  } catch { return []; }
}

interface ShrineCollectionProps {
  onClose: () => void;
}

export default function ShrineCollection({ onClose }: ShrineCollectionProps) {
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUnlocked(getUnlockedShrines());
    setMounted(true);
  }, []);

  const completionRate = Math.round((unlocked.length / SHRINES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}>
      <div
        className="rounded-2xl p-5 w-full max-w-xs shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #1a0a00, #2d1800)",
          border: "2px solid rgba(212,175,55,0.5)",
          boxShadow: "0 0 40px rgba(212,175,55,0.2)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black" style={{ color: "#d4af37" }}>⛩️ 神様図鑑</h2>
          <button onClick={onClose} className="text-amber-500 hover:text-amber-300 text-xl leading-none">✕</button>
        </div>

        {/* 達成率 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-amber-400">コレクション達成率</span>
            <span className="text-sm font-black" style={{ color: "#fcd34d" }}>
              {unlocked.length}/{SHRINES.length} ({completionRate}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "rgba(212,175,55,0.15)" }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${completionRate}%`,
                background: completionRate >= 100
                  ? "linear-gradient(90deg, #fcd34d, #f59e0b)"
                  : "linear-gradient(90deg, #d4af37, #f59e0b)",
                boxShadow: completionRate >= 100 ? "0 0 8px rgba(212,175,55,0.6)" : "none",
              }}
            />
          </div>
          {completionRate >= 100 && (
            <p className="text-center text-xs font-black mt-1" style={{ color: "#fcd34d" }}>
              ✨ 全神様コレクション達成！
            </p>
          )}
        </div>

        {/* 神様グリッド */}
        <div className="grid grid-cols-3 gap-2">
          {SHRINES.map((shrine) => {
            const isUnlocked = unlocked.includes(shrine.level);
            return (
              <div
                key={shrine.level}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  background: isUnlocked ? shrine.bgColor : "rgba(255,255,255,0.04)",
                  border: isUnlocked
                    ? "1px solid rgba(212,175,55,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  opacity: isUnlocked ? 1 : 0.4,
                  boxShadow: isUnlocked && shrine.level >= 7 ? "0 0 10px rgba(212,175,55,0.3)" : "none",
                }}
              >
                <div className="text-2xl mb-1">
                  {isUnlocked ? shrine.emoji : "❓"}
                </div>
                <div className="text-xs font-bold" style={{ color: isUnlocked ? shrine.color : "rgba(255,255,255,0.3)" }}>
                  {isUnlocked ? shrine.name : "???"}
                </div>
                {isUnlocked && (
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {shrine.goryaku}
                  </div>
                )}
                {!isUnlocked && (
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                    未解放
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ヒント */}
        {unlocked.length < SHRINES.length && (
          <div className="mt-4 rounded-xl p-3 text-center"
            style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
            <p className="text-xs text-amber-500">
              神社を合成するたびに図鑑が解放されます。<br />
              次は「{SHRINES.find(s => !unlocked.includes(s.level))?.name ?? "天照大神"}」を目指しましょう！
            </p>
          </div>
        )}

        {/* コンプリートシェア */}
        {completionRate >= 100 && (
          <div className="mt-3 text-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("神社マージ 神様図鑑コンプリート！⛩️✨ 鳥居から天照大神まで全9種類の神様を解放しました！ → https://shrine-merge.vercel.app #神社マージ #コンプリート")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-xs transition-all active:scale-95"
              style={{ background: "#000" }}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              コンプリートをXで自慢
            </a>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl font-black text-base transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00" }}
        >
          参拝を続ける ⛩️
        </button>
      </div>
    </div>
  );
}
