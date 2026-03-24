"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SHRINES } from "@/lib/game";
import { getUnlockedShrines } from "@/components/ShrineCollection";

// 各神社の由来・説明文
const SHRINE_DESCRIPTIONS: Record<number, string> = {
  1: "鳥居は神域と俗界の境界を示す象徴的な門。朱塗りが多く、くぐることで心身が清められるとされる。",
  2: "狛犬は神社の参道に置かれる一対の守護獣像。「阿吽（あうん）」の口で宇宙の始まりと終わりを表す。",
  3: "手水舎は参拝前に手と口を清める場所。左手・右手・口・左手の順で清める作法が正式とされる。",
  4: "拝殿は参拝者が礼拝するための建物。「二礼二拍手一礼」の参拝作法はここで行う日本固有の儀式。",
  5: "本殿は御祭神（ご神体）が祀られる最も神聖な空間。一般の参拝者は立ち入れない聖域とされる。",
  6: "神宮の称号は天皇・皇族にゆかりの深い神社にのみ許される最高格式。伊勢神宮が総代として知られる。",
  7: "大社は神格が特に高い神社に与えられる称号。出雲大社や住吉大社は縁結びと航海安全の名社として名高い。",
  8: "総本社は全国に分社を持つ神社の総元締め。稲荷神社の総本社・伏見稲荷大社には年間300万人超が訪れる。",
  9: "天照大神は日本神話における最高神・太陽神。天皇家の祖先神として、伊勢神宮内宮に祀られている。",
};

export default function CollectionClient() {
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
        <p className="text-amber-300 animate-pulse"> 図鑑を読み込み中...</p>
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
             神様図鑑
          </h1>
          <Link href="/" className="text-amber-400 text-sm hover:text-amber-300">トップ</Link>
        </div>

        {/* SEOリード文 */}
        <p className="text-xs text-amber-600 text-center mb-4 leading-relaxed">
          神社マージに登場する全9種の神社・ご利益一覧。ゲームで合成するたびに図鑑が解放されます。
        </p>

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
               全神様コレクション達成！
            </p>
          )}
        </div>

        {/* 神様グリッド（詳細説明付き） */}
        <div className="space-y-3 mb-6">
          {SHRINES.map((shrine) => {
            const isUnlocked = unlocked.includes(shrine.level);
            return (
              <div
                key={shrine.level}
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: isUnlocked ? shrine.bgColor + "22" : "rgba(255,255,255,0.04)",
                  border: isUnlocked
                    ? "1px solid rgba(212,175,55,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  opacity: isUnlocked ? 1 : 0.45,
                  boxShadow: isUnlocked && shrine.level >= 7 ? "0 0 14px rgba(212,175,55,0.2)" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl shrink-0">
                    {isUnlocked ? shrine.emoji : ""}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-black" style={{ color: isUnlocked ? shrine.color === "#1a1a1a" ? "#fcd34d" : "#fde68a" : "rgba(255,255,255,0.3)" }}>
                        {isUnlocked ? shrine.name : "???"}
                      </span>
                      {isUnlocked && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.5)" }}>
                          Lv.{shrine.level}
                        </span>
                      )}
                    </div>
                    {isUnlocked && (
                      <>
                        <p className="text-xs font-bold mb-1" style={{ color: "rgba(212,175,55,0.8)" }}>
                          御利益: {shrine.goryaku}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(253,230,138,0.65)" }}>
                          {SHRINE_DESCRIPTIONS[shrine.level]}
                        </p>
                      </>
                    )}
                    {!isUnlocked && (
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                        未解放 — ゲームで合成して解放しよう
                      </p>
                    )}
                  </div>
                </div>
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
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("神社マージ 神様図鑑コンプリート！️ 鳥居から天照大神まで全9種類の神様を解放しました！ → https://shrine-merge.vercel.app/collection #神社マージ #コンプリート")}`}
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
            ️ 神様を集めに行く
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/ranking" className="text-amber-500 text-xs hover:text-amber-300"> 週次ランキングを見る</Link>
        </div>
      </div>
    </div>
  );
}
