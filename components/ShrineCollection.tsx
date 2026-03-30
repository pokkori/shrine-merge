"use client";

import { useEffect, useState } from "react";
import { SHRINES } from "@/lib/game";
import ShrineSvgIcon from "./ShrineSvgIcon";

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

/* Lock icon SVG */
function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="14" y="28" width="36" height="28" rx="4" fill="rgba(255,255,255,0.15)" />
      <path d="M22 28V20a10 10 0 0120 0v8" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="42" r="4" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}

/* Checkmark icon SVG for completion */
function CheckSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#22c55e" />
      <path d="M7 12l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 40px rgba(212,175,55,0.2)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-100">神様図鑑</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-100 text-xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="図鑑を閉じる">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-300">コレクション達成率</span>
            <span className="text-sm font-black text-slate-100">
              {unlocked.length}/{SHRINES.length} ({completionRate}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
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
            <p className="text-center text-xs font-black mt-1 flex items-center justify-center gap-1 text-slate-100">
              <CheckSvg /> 全神様コレクション達成!
            </p>
          )}
        </div>

        {/* Shrine grid */}
        <div className="grid grid-cols-3 gap-2">
          {SHRINES.map((shrine) => {
            const isUnlocked = unlocked.includes(shrine.level);
            return (
              <div
                key={shrine.level}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  background: isUnlocked ? shrine.bgColor : "rgba(255,255,255,0.03)",
                  border: isUnlocked
                    ? "1px solid rgba(212,175,55,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  opacity: isUnlocked ? 1 : 0.4,
                  boxShadow: isUnlocked && shrine.level >= 7 ? "0 0 10px rgba(212,175,55,0.3)" : "none",
                }}
              >
                <div className="flex justify-center mb-1">
                  {isUnlocked ? <ShrineSvgIcon level={shrine.level} size={28} /> : <LockIcon />}
                </div>
                <div className="text-xs font-bold" style={{ color: isUnlocked ? shrine.color : "rgba(255,255,255,0.3)" }}>
                  {isUnlocked ? shrine.name : "???"}
                </div>
                {isUnlocked && (
                  <div className="text-[10px] mt-0.5 text-slate-300">
                    {shrine.goryaku}
                  </div>
                )}
                {!isUnlocked && (
                  <div className="text-[10px] mt-0.5 text-slate-500">
                    未解放
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hint */}
        {unlocked.length < SHRINES.length && (
          <div className="mt-4 rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs text-slate-300">
              神社を合成するたびに図鑑が解放されます。<br />
              次は「{SHRINES.find(s => !unlocked.includes(s.level))?.name ?? "天照大神"}」を目指しましょう!
            </p>
          </div>
        )}

        {/* Complete share */}
        {completionRate >= 100 && (
          <div className="mt-3 text-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("神社マージ 神様図鑑コンプリート! 鳥居から天照大神まで全9種類の神様を解放しました! -> https://shrine-merge.vercel.app #神社マージ #コンプリート")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-xs transition-all active:scale-[0.97] min-h-[44px]"
              style={{ background: "#000" }}
              aria-label="コンプリートをXでシェア"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              コンプリートをXで自慢
            </a>
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="参拝を続ける"
          className="w-full mt-4 py-3 rounded-xl font-black text-base transition-all active:scale-[0.97] min-h-[44px]"
          style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00", boxShadow: "0 0 16px rgba(212,175,55,0.3)" }}
        >
          参拝を続ける
        </button>
      </div>
    </div>
  );
}
