"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SHRINES } from "@/lib/game";

interface RankingEntry {
  rank: number;
  name: string;
  score: number;
  highestLevel: number;
  isMe: boolean;
}

// 擬似全国ランキングデータ（シード固定で週ごとに変わる）
function getWeekSeed(): number {
  const d = new Date();
  const weekNum = Math.floor(d.getTime() / (7 * 24 * 60 * 60 * 1000));
  return weekNum;
}

const FAKE_NAMES = [
  "参拝者@京都", "shrine_master", "神社好き🦊", "鳥居通過者",
  "天照大神目指し中", "和風ゲーム民", "御利益ゲット勢", "⛩️毎日参拝",
  "パズル廃人", "日本文化愛好家", "合体神社職人", "大社到達済み",
  "稲荷神社ファン", "御朱印コレクター", "神社マージ古参",
];

function generateFakeRanking(seed: number): RankingEntry[] {
  // seededランダム
  const seededRand = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297 + 233) * 100000;
    return x - Math.floor(x);
  };

  return Array.from({ length: 10 }, (_, i) => {
    const baseScore = Math.floor(20000 - i * 1500 + seededRand(i) * 800);
    const highestLevel = Math.min(9, 9 - Math.floor(i / 2));
    return {
      rank: i + 1,
      name: FAKE_NAMES[Math.floor(seededRand(i + 100) * FAKE_NAMES.length)],
      score: Math.max(baseScore, 1000),
      highestLevel,
      isMe: false,
    };
  });
}

function getMyRankingData(): { score: number; highestShrineLevel: number } {
  if (typeof window === "undefined") return { score: 0, highestShrineLevel: 1 };
  const bestScore = parseInt(localStorage.getItem("shrine-merge-best") ?? "0", 10);
  const highestShrineLevel = parseInt(localStorage.getItem("shrine-highest-level-ever") ?? "1", 10);
  return { score: bestScore, highestShrineLevel };
}

function getWeeklyBest(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekKey = weekStart.toISOString().slice(0, 10);
  const stored = localStorage.getItem(`shrine_weekly_best_${weekKey}`);
  return stored ? parseInt(stored, 10) : 0;
}

export function updateWeeklyBest(score: number): void {
  if (typeof window === "undefined") return;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekKey = weekStart.toISOString().slice(0, 10);
  const current = parseInt(localStorage.getItem(`shrine_weekly_best_${weekKey}`) ?? "0", 10);
  if (score > current) {
    localStorage.setItem(`shrine_weekly_best_${weekKey}`, String(score));
  }
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [myData, setMyData] = useState({ score: 0, highestShrineLevel: 1 });
  const [myRank, setMyRank] = useState<number | null>(null);
  const [weeklyBest, setWeeklyBest] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const seed = getWeekSeed();
    const fakeRanking = generateFakeRanking(seed);
    const me = getMyRankingData();
    const wb = getWeeklyBest();
    setMyData(me);
    setWeeklyBest(wb);

    // 自分のスコアを挿入してランクを決定
    const myScore = wb > 0 ? wb : me.score;
    let inserted = false;
    const finalRanking: RankingEntry[] = [];
    let rank = 1;
    for (const entry of fakeRanking) {
      if (!inserted && myScore > entry.score) {
        finalRanking.push({ rank, name: "あなた", score: myScore, highestLevel: me.highestShrineLevel, isMe: true });
        setMyRank(rank);
        rank++;
        inserted = true;
      }
      finalRanking.push({ ...entry, rank });
      rank++;
    }
    if (!inserted) {
      const myFinalRank = finalRanking.length + 1;
      setMyRank(myFinalRank);
      finalRanking.push({ rank: myFinalRank, name: "あなた", score: myScore, highestLevel: me.highestShrineLevel, isMe: true });
    }

    setRanking(finalRanking.slice(0, 11)); // TOP10 + あなた（11位以降も表示）
    setMounted(true);
  }, []);

  // 週のリセットカウントダウン
  const getWeekReset = () => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(next.getDate() + (7 - next.getDay()));
    next.setHours(0, 0, 0, 0);
    const diff = next.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}日${hours}時間`;
  };

  const rankColors = ["#ffd700", "#c0c0c0", "#cd7f32"];
  const rankEmojis = ["🥇", "🥈", "🥉"];

  if (!mounted) {
    return (
      <div className="starry-bg min-h-screen flex items-center justify-center">
        <p className="text-amber-300 animate-pulse">⛩️ ランキング読み込み中...</p>
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
            🏆 週次ランキング
          </h1>
          <Link href="/" className="text-amber-400 text-sm hover:text-amber-300">トップ</Link>
        </div>

        {/* リセットカウントダウン */}
        <div className="rounded-xl p-3 mb-5 text-center"
          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
          <p className="text-xs text-amber-400">
            🔄 ランキングリセットまで <span className="font-black text-amber-200">{getWeekReset()}</span>
          </p>
          <p className="text-xs text-amber-600 mt-1">毎週日曜0時にリセット • あなたの今週ベスト: {(weeklyBest || myData.score).toLocaleString()}点</p>
        </div>

        {/* あなたの順位バッジ */}
        {myRank !== null && (
          <div className="rounded-2xl p-4 mb-5 text-center"
            style={{
              background: myRank <= 3 ? "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,158,11,0.1))" : "rgba(255,255,255,0.06)",
              border: `1px solid ${myRank <= 3 ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.2)"}`,
              boxShadow: myRank <= 3 ? "0 0 20px rgba(212,175,55,0.2)" : "none",
            }}>
            <p className="text-2xl font-black mb-1" style={{ color: myRank <= 3 ? "#fcd34d" : "#d4af37" }}>
              {myRank <= 3 ? rankEmojis[myRank - 1] : `${myRank}位`} {myRank <= 3 && `${myRank}位`}
            </p>
            <p className="text-sm text-amber-300 font-bold">今週の全国順位</p>
            {myRank <= 10 && (
              <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-black"
                style={{ background: "rgba(212,175,55,0.2)", color: "#fcd34d", border: "1px solid rgba(212,175,55,0.4)" }}>
                🌟 全国TOP10入り！
              </div>
            )}
            {myRank <= 10 && (
              <div className="mt-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`神社マージ週次ランキング ${myRank}位達成！🏆⛩️ ${(weeklyBest || myData.score).toLocaleString()}点で全国TOP10！ → https://shrine-merge.vercel.app/ranking #神社マージ #ランキング`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-xs transition-all active:scale-95"
                  style={{ background: "#000" }}
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Xで順位を自慢する
                </a>
              </div>
            )}
          </div>
        )}

        {/* ランキングテーブル */}
        <div className="space-y-2 mb-6">
          {ranking.map((entry) => {
            const shrine = SHRINES[Math.min(entry.highestLevel - 1, SHRINES.length - 1)];
            return (
              <div
                key={`${entry.rank}-${entry.name}`}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background: entry.isMe
                    ? "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,158,11,0.1))"
                    : entry.rank <= 3
                    ? "rgba(212,175,55,0.08)"
                    : "rgba(255,255,255,0.04)",
                  border: entry.isMe
                    ? "2px solid rgba(212,175,55,0.5)"
                    : entry.rank <= 3
                    ? "1px solid rgba(212,175,55,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: entry.isMe ? "0 0 12px rgba(212,175,55,0.2)" : "none",
                }}
              >
                {/* 順位 */}
                <div className="w-8 text-center">
                  {entry.rank <= 3 ? (
                    <span className="text-xl">{rankEmojis[entry.rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-black" style={{ color: "#d4af37" }}>{entry.rank}</span>
                  )}
                </div>
                {/* 最高神社 */}
                <span className="text-xl">{shrine.emoji}</span>
                {/* 名前・神社名 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: entry.isMe ? "#fcd34d" : "#fde68a" }}>
                    {entry.name} {entry.isMe && "← あなた"}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(212,175,55,0.6)" }}>
                    最高: {shrine.name}
                  </p>
                </div>
                {/* スコア */}
                <div className="text-right">
                  <p className="font-black text-sm" style={{ color: entry.rank <= 3 ? rankColors[entry.rank - 1] : "#d4af37" }}>
                    {entry.score.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(212,175,55,0.5)" }}>点</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* スコアアップの誘導 */}
        <div className="rounded-2xl p-4 mb-6 text-center"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <p className="text-amber-300 font-bold text-sm mb-1">🎯 ランキングを上げるには？</p>
          <p className="text-amber-500 text-xs leading-relaxed">
            毎日プレイしてスコアを更新しよう。<br />
            週末リセット前の最高スコアがランクに反映されます。
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/game"
            className="inline-block px-10 py-4 rounded-2xl font-black text-lg transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00", boxShadow: "0 0 20px rgba(212,175,55,0.3)" }}
          >
            ⛩️ スコアを更新する
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-amber-700">※ランキングはブラウザ内スコアをもとに算出しています</p>
        </div>
      </div>
    </div>
  );
}
