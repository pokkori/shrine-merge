"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SHRINES } from "@/lib/game";
import { getUnlockedShrines } from "@/components/ShrineCollection";

export default function CollectionPage() {
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUnlocked(getUnlockedShrines());
    setMounted(true);
  }, []);

  const completionRate = Math.round((unlocked.length / SHRINES.length) * 100);

  if (!mounted) {
    return (
      <div className="starry-bg min-h-screen flex items-center justify-center">
        <p className="text-amber-300 animate-pulse">📖 図鑑を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="starry-bg min-h-screen py-6 px-4">
      <div className="max-w-sm mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/game" className="text-amber-400 text-sm hover:text-amber-300">← ゲームへ</Link>
          <h1 className="text-xl font-black" style={{ color: "#d4af37", textShadow: "0 0 12px rgba(212,175,55,0.5)" }}>
            📖 神様図鑑
          </h1>
          <Link href="/" className="text-amber-400 text-sm hover:text-amber-300">トップ</Link>
        </div>

        {/* 達成率 */}
        <div className="rounded-2xl p-4 mb-5"
          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-amber-400 font-bold">コレクション達成率</span>
            <span className="text-lg font-black" style={{ color: "#fcd34d" }}>
              {unlocked.length}/{SHRINES.length} ({completionRate}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ background: "rgba(212,175,55,0.15)" }}>
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{
                width: `${completionRate}%`,
                background: completionRate >= 100
                  ? "linear-gradient(90deg, #fcd34d, #f59e0b)"
                  : "linear-gradient(90deg, #d4af37, #f59e0b)",
                boxShadow: completionRate >= 100 ? "0 0 10px rgba(212,175,55,0.6)" : "none",
              }}
            />
          </div>
          {completionRate >= 100 && (
            <p className="text-center text-sm font-black mt-2" style={{ color: "#fcd34d" }}>
              ✨ 全神様コレクション達成！
            </p>
          )}
        </div>

        {/* 神様グリッド */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {SHRINES.map((shrine) => {
            const isUnlocked = unlocked.includes(shrine.level);
            return (
              <div
                key={shrine.level}
                className="rounded-2xl p-4 text-center transition-all"
                style={{
                  background: isUnlocked ? shrine.bgColor : "rgba(255,255,255,0.04)",
                  border: isUnlocked
                    ? "1px solid rgba(212,175,55,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  opacity: isUnlocked ? 1 : 0.4,
                  boxShadow: isUnlocked && shrine.level >= 7 ? "0 0 14px rgba(212,175,55,0.35)" : "none",
                }}
              >
                <div className="text-3xl mb-2">
                  {isUnlocked ? shrine.emoji : "❓"}
                </div>
                <div className="text-sm font-bold" style={{ color: isUnlocked ? shrine.color : "rgba(255,255,255,0.3)" }}>
                  {isUnlocked ? shrine.name : "???"}
                </div>
                {isUnlocked && (
                  <>
                    <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                      御利益: {shrine.goryaku}
                    </div>
                    <div className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block"
                      style={{ background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.5)" }}>
                      Lv.{shrine.level}
                    </div>
                  </>
                )}
                {!isUnlocked && (
                  <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                    未解放
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ヒント */}
        {unlocked.length < SHRINES.length && (
          <div className="rounded-2xl p-4 mb-5 text-center"
            style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
            <p className="text-amber-400 font-bold text-sm mb-1">次の目標</p>
            <p className="text-amber-500 text-xs leading-relaxed">
              神社を合成するたびに図鑑が解放されます。<br />
              次は「{SHRINES.find(s => !unlocked.includes(s.level))?.name ?? "天照大神"}」を合成して解放しましょう！
            </p>
          </div>
        )}

        {/* コンプリートシェア */}
        {completionRate >= 100 && (
          <div className="mb-5 text-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("神社マージ 神様図鑑コンプリート！⛩️✨ 鳥居から天照大神まで全9種類の神様を解放しました！ → https://shrine-merge.vercel.app/collection #神社マージ #コンプリート")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
              style={{ background: "#000" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              コンプリートをXで自慢する
            </a>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/game"
            className="inline-block px-10 py-4 rounded-2xl font-black text-lg transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00", boxShadow: "0 0 20px rgba(212,175,55,0.3)" }}
          >
            ⛩️ 神様を集めに行く
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/ranking" className="text-amber-500 text-xs hover:text-amber-300">🏆 週次ランキングを見る</Link>
        </div>
      </div>
    </div>
  );
}
