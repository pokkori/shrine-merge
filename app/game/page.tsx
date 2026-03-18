"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ShrineGrid from "@/components/ShrineGrid";
import ScoreBoard from "@/components/ScoreBoard";
import KomojuButton from "@/components/KomojuButton";
import { useGameAudio } from "@/hooks/useGameAudio";
import {
  GameState,
  Direction,
  SHRINES,
  OMIKUJI_COST,
  initGame,
  moveGrid,
  addRandomCell,
  canMove,
  getHighestLevel,
  loadBestScore,
  saveBestScore,
  calcGoryakuGain,
} from "@/lib/game";

const DAILY_FREE_LIMIT = 3;
const AMATERASU_LEVEL = 9; // 天照大神のレベル

// ─── ストリーク ─────────────────────────────────────────────────────────────

function getShrineStreakData(): { streak: number; lastDate: string } {
  try {
    return JSON.parse(localStorage.getItem("shrine_streak") ?? "{}") ?? { streak: 0, lastDate: "" };
  } catch { return { streak: 0, lastDate: "" }; }
}

function updateShrineStreak(): { streak: number; isNew: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const data = getShrineStreakData();
  if (data.lastDate === today) return { streak: data.streak, isNew: false };
  const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
  localStorage.setItem("shrine_streak", JSON.stringify({ streak: newStreak, lastDate: today }));
  return { streak: newStreak, isNew: true };
}

// ─── デイリーチャレンジ (日付seed) ───────────────────────────────────────────

function getShrineDailyChallengeTarget(): number {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return 256 + (seed % 7) * 128; // 256〜1024ptの間
}

function getShrineDailyChallengeStatus(): { target: number; best: number; cleared: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const target = getShrineDailyChallengeTarget();
  try {
    const data = JSON.parse(localStorage.getItem("shrine_daily_challenge") ?? "{}");
    if (data.date === today) {
      return { target, best: data.best ?? 0, cleared: (data.best ?? 0) >= target };
    }
  } catch { /* */ }
  return { target, best: 0, cleared: false };
}

function saveShrineDailyChallengeScore(score: number): void {
  const today = new Date().toISOString().slice(0, 10);
  const current = getShrineDailyChallengeStatus();
  if (score > current.best) {
    localStorage.setItem("shrine_daily_challenge", JSON.stringify({ date: today, best: score }));
  }
}

function getDailyPlayCount(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toISOString().slice(0, 10);
  const stored = localStorage.getItem("jinja-daily-plays");
  if (!stored) return 0;
  try {
    const data = JSON.parse(stored);
    return data.date === today ? data.count : 0;
  } catch {
    return 0;
  }
}

function incrementDailyPlayCount(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  const current = getDailyPlayCount();
  localStorage.setItem("jinja-daily-plays", JSON.stringify({ date: today, count: current + 1 }));
}

function getDailyBestScore(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toISOString().slice(0, 10);
  return parseInt(localStorage.getItem(`shrine_daily_best_${today}`) ?? "0", 10);
}

function saveDailyBestScore(score: number): boolean {
  if (typeof window === "undefined") return false;
  const today = new Date().toISOString().slice(0, 10);
  const current = getDailyBestScore();
  if (score > current) {
    localStorage.setItem(`shrine_daily_best_${today}`, String(score));
    return true;
  }
  return false;
}

export default function GamePage() {
  const [state, setState] = useState<GameState | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumChecked, setPremiumChecked] = useState(false);
  const [dailyPlays, setDailyPlays] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [dailyBest, setDailyBest] = useState(0);
  const [isNewDailyBest, setIsNewDailyBest] = useState(false);
  const [showAmaterasuCelebration, setShowAmaterasuCelebration] = useState(false);
  const [amaterasuShown, setAmaterasuShown] = useState(false);
  const [shrineStreak, setShrineStreak] = useState(0);
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(() => getShrineDailyChallengeStatus());
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isMoving = useRef(false);
  const goryakuInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { startBGM, playSE, toggleMute, isMuted } = useGameAudio();

  // Check premium status
  useEffect(() => {
    fetch("/api/auth/status")
      .then(r => r.json())
      .then(data => {
        setIsPremium(data.isPremium);
        setPremiumChecked(true);
      })
      .catch(() => setPremiumChecked(true));
  }, []);

  useEffect(() => {
    const best = loadBestScore();
    const plays = getDailyPlayCount();
    setDailyPlays(plays);
    setDailyBest(getDailyBestScore());
    setState(initGame(best));
    // ストリーク更新
    const { streak, isNew } = updateShrineStreak();
    setShrineStreak(streak);
    if (isNew && streak >= 2) {
      setShowStreakBanner(true);
      setTimeout(() => setShowStreakBanner(false), 3000);
    }
    // デイリーチャレンジ初期化
    setDailyChallenge(getShrineDailyChallengeStatus());
  }, []);

  useEffect(() => {
    if (!state || state.isGameOver) return;
    const multiplier = isPremium ? 2 : 1;
    goryakuInterval.current = setInterval(() => {
      setState(prev => {
        if (!prev || prev.isGameOver) return prev;
        const gain = calcGoryakuGain(prev.grid) * multiplier;
        return { ...prev, goryakuPoints: prev.goryakuPoints + gain };
      });
    }, 1000);
    return () => {
      if (goryakuInterval.current) clearInterval(goryakuInterval.current);
    };
  }, [state?.isGameOver, isPremium]);

  const handleMove = useCallback((direction: Direction) => {
    if (isMoving.current) return;
    setState(prev => {
      if (!prev || prev.isGameOver) return prev;
      isMoving.current = true;
      const { grid: movedGrid, scoreGained, moved } = moveGrid(prev.grid, direction);
      if (!moved) {
        isMoving.current = false;
        return prev;
      }
      const newGrid = addRandomCell(movedGrid);
      const newScore = prev.score + scoreGained;
      const newBest = Math.max(newScore, prev.bestScore);
      if (newBest > prev.bestScore) saveBestScore(newBest);
      const highestLevel = getHighestLevel(newGrid);
      const gameOver = !canMove(newGrid);
      if (scoreGained > 0) {
        const mergeLevel = getHighestLevel(newGrid);
        if (mergeLevel >= 6) {
          setTimeout(() => playSE("levelup"), 0);
        } else {
          setTimeout(() => playSE("merge"), 0);
        }
        setTimeout(() => playSE("score"), 80);
      }
      if (gameOver) setTimeout(() => playSE("gameover"), 300);
      setTimeout(() => { isMoving.current = false; }, 120);
      return {
        ...prev,
        grid: newGrid,
        score: newScore,
        bestScore: newBest,
        highestLevel: Math.max(prev.highestLevel, highestLevel),
        isGameOver: gameOver,
      };
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowLeft: "left", ArrowRight: "right",
        ArrowUp: "up", ArrowDown: "down",
      };
      if (map[e.key]) {
        e.preventDefault();
        startBGM();
        handleMove(map[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    startBGM();
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      handleMove(dx > 0 ? "right" : "left");
    } else {
      handleMove(dy > 0 ? "down" : "up");
    }
    touchStart.current = null;
  };

  const handleOmikuji = () => {
    playSE("omikuji");
    setState(prev => {
      if (!prev || prev.goryakuPoints < OMIKUJI_COST) return prev;
      const newGrid = addRandomCell(prev.grid);
      return { ...prev, grid: newGrid, goryakuPoints: prev.goryakuPoints - OMIKUJI_COST };
    });
  };

  // Update daily best when game ends
  useEffect(() => {
    if (!state?.isGameOver) return;
    const updated = saveDailyBestScore(state.score);
    setDailyBest(getDailyBestScore());
    setIsNewDailyBest(updated);
    // デイリーチャレンジ保存
    saveShrineDailyChallengeScore(state.score);
    setDailyChallenge(getShrineDailyChallengeStatus());
  }, [state?.isGameOver]);

  const handleRestart = () => {
    // Check daily limit for free users
    if (!isPremium) {
      const plays = getDailyPlayCount();
      if (plays >= DAILY_FREE_LIMIT) {
        setShowPaywall(true);
        return;
      }
      incrementDailyPlayCount();
      setDailyPlays(plays + 1);
    }
    if (goryakuInterval.current) clearInterval(goryakuInterval.current);
    const best = loadBestScore();
    setState(initGame(best));
  };

  // Count initial game load as a play
  useEffect(() => {
    if (!premiumChecked) return;
    if (!isPremium) {
      const plays = getDailyPlayCount();
      if (plays === 0) {
        incrementDailyPlayCount();
        setDailyPlays(1);
      }
    }
  }, [premiumChecked, isPremium]);

  const handlePaySuccess = () => {
    setShowPayjp(false);
    setIsPremium(true);
    setShowPaywall(false);
    window.location.href = "/success";
  };

  if (!state) {
    return (
      <div className="starry-bg min-h-screen flex items-center justify-center">
        <p className="text-amber-300 text-lg animate-pulse">⛩️ 読み込み中...</p>
      </div>
    );
  }

  // 天照大神到達チェック
  useEffect(() => {
    if (!state || amaterasuShown) return;
    if (state.highestLevel >= AMATERASU_LEVEL) {
      setShowAmaterasuCelebration(true);
      setAmaterasuShown(true);
    }
  }, [state?.highestLevel]);

  const highestShrine = SHRINES[state.highestLevel - 1];
  // スコアによる上位%推定（バイラル設計）
  const shrineTopPercent = state.score >= 2000 ? "上位5%" : state.score >= 1000 ? "上位20%" : state.score >= 500 ? "上位40%" : "入門者";
  const shareMsg = `【神社マージ】${state.score.toLocaleString()}点・${shrineTopPercent}の参拝力！⛩️ 最高神社「${highestShrine.emoji}${highestShrine.name}」(${highestShrine.goryaku}) あなたは天照大神まで辿り着ける？ → https://shrine-merge.vercel.app #神社マージ #パズルゲーム #神社`;
  const shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareMsg);
  const remainingPlays = isPremium ? null : Math.max(0, DAILY_FREE_LIMIT - dailyPlays);
  const dailyChallengeProgress = Math.min(100, Math.round((dailyChallenge.best / dailyChallenge.target) * 100));

  return (
    <div
      className="starry-bg min-h-screen flex flex-col items-center justify-start py-4 px-3"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ストリークバナー */}
      {showStreakBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3 rounded-2xl font-black text-lg shadow-2xl animate-bounce"
            style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00", boxShadow: "0 0 30px rgba(212,175,55,0.7)" }}>
            🔥 {shrineStreak}日連続参拝！御利益UP！
          </div>
        </div>
      )}

      {/* デイリーチャレンジバー */}
      <div className="w-full max-w-sm px-1 pt-1 mb-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold" style={{ color: "#d4af37" }}>
            📅 今日のお告げ {dailyChallenge.cleared ? "✅ 達成！" : `目標: ${dailyChallenge.target.toLocaleString()}pt`}
          </span>
          {shrineStreak >= 2 && (
            <span className="text-[10px] font-bold text-amber-400">🔥 {shrineStreak}日連続</span>
          )}
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(212,175,55,0.15)" }}>
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${dailyChallengeProgress}%`,
              background: dailyChallenge.cleared
                ? "linear-gradient(90deg, #34d399, #10b981)"
                : "linear-gradient(90deg, #d4af37, #f59e0b)",
            }} />
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto flex items-center justify-between mb-3">
        <a href="/" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">&#8592; トップ</a>
        <h1 className="text-xl font-black" style={{ color: "#d4af37", textShadow: "0 0 12px rgba(212,175,55,0.5)" }}>
          ⛩️ 神社マージ
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-xl leading-none"
            aria-label={isMuted ? "ミュート解除" : "ミュート"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={() => { playSE("button"); handleRestart(); }}
            className="text-xs px-3 py-1 rounded-lg font-bold transition-all active:scale-95"
            style={{ background: "rgba(212,175,55,0.2)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)" }}
          >
            リセット
          </button>
        </div>
      </div>

      {/* Daily play counter for free users */}
      {!isPremium && premiumChecked && (
        <div className="w-full max-w-sm mb-2 text-center">
          <span className="text-xs px-3 py-1 rounded-full"
            style={{
              background: remainingPlays === 0 ? "rgba(239,68,68,0.2)" : "rgba(212,175,55,0.15)",
              color: remainingPlays === 0 ? "#fca5a5" : "#d4af37",
              border: `1px solid ${remainingPlays === 0 ? "rgba(239,68,68,0.3)" : "rgba(212,175,55,0.25)"}`,
            }}>
            本日の残りプレイ: {remainingPlays}/{DAILY_FREE_LIMIT}
          </span>
        </div>
      )}

      {isPremium && (
        <div className="w-full max-w-sm mb-2 text-center">
          <span className="text-xs px-3 py-1 rounded-full"
            style={{ background: "rgba(212,175,55,0.2)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)" }}>
            &#11088; プレミアム &#8212; 無制限プレイ &amp; 御利益2倍速
          </span>
        </div>
      )}

      <div className="w-full max-w-sm mb-3">
        <ScoreBoard
          score={state.score}
          bestScore={state.bestScore}
          goryakuPoints={state.goryakuPoints}
        />
      </div>

      <div className="w-full max-w-sm mb-3 flex items-center gap-2 px-2 py-2 rounded-xl"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
        <span className="text-xs text-amber-400">最高位:</span>
        <span className="text-lg">{highestShrine.emoji}</span>
        <span className="text-sm font-bold text-amber-200">{highestShrine.name}</span>
        <span className="text-xs text-amber-500 ml-auto">御利益: {highestShrine.goryaku}</span>
      </div>

      <div className="w-full max-w-sm mb-4">
        <ShrineGrid grid={state.grid} />
      </div>
      <div className="w-full max-w-sm mb-2">
        <button
          onClick={handleOmikuji}
          disabled={state.goryakuPoints < OMIKUJI_COST}
          className={`w-full py-3 rounded-xl font-black text-base transition-all active:scale-95 ${
            state.goryakuPoints >= OMIKUJI_COST ? "btn-gold" : ""
          }`}
          style={state.goryakuPoints < OMIKUJI_COST
            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", cursor: "not-allowed" }
            : {}
          }
        >
          🎋 おみくじを引く（御利益 {OMIKUJI_COST}pt）
        </button>
        <p className="text-center text-xs text-amber-600 mt-1">
          おみくじでグリッドにランダムな神社が出現します
        </p>
      </div>

      <div className="w-full max-w-sm rounded-xl p-3 mt-2"
        style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
        <p className="text-xs text-amber-400 text-center">
          &#8592; &#8594; &#8593; &#8595; キー または スワイプで操作 ／ 同じ神社を合わせてマージ！
        </p>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div
            className="rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #1a0a20, #2d1040)",
              border: "1px solid rgba(212,175,55,0.4)",
              boxShadow: "0 0 40px rgba(212,175,55,0.2)",
            }}
          >
            <div className="text-5xl mb-2">⛩️</div>
            <h2 className="text-2xl font-black mb-1" style={{ color: "#d4af37" }}>本日のプレイ上限</h2>
            <p className="text-amber-400 text-sm mb-4">
              無料版は1日{DAILY_FREE_LIMIT}回までプレイできます
            </p>
            <div className="rounded-xl p-4 mb-4 space-y-2"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <p className="text-amber-200 font-bold text-sm mb-2">プレミアム会員なら</p>
              {[
                "無制限参拝（1日何度でも）",
                "御利益ポイント2倍速で金運UP",
                "全ての神社がアンロック",
                "広告なし（集中して参拝）",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-sm text-amber-300">
                  <span className="text-amber-500">&#10003;</span>{feat}
                </div>
              ))}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(212,175,55,0.2)" }}>
                <span className="text-2xl font-black" style={{ color: "#d4af37" }}>&#165;480</span>
                <span className="text-amber-400 text-sm">/月</span>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setShowPaywall(false); setShowPayjp(true); }}
                className="w-full py-3 rounded-xl font-black text-base transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f59e0b)",
                  color: "#1a0a00",
                }}
              >
                🙏 プレミアムで御利益アップ
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-2 text-sm text-amber-500 hover:text-amber-300 transition-colors"
              >
                明日また遊ぶ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {state.isGameOver && !showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div
            className="rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #1a0a20, #2d1040)",
              border: "1px solid rgba(212,175,55,0.4)",
              boxShadow: "0 0 40px rgba(212,175,55,0.2)",
            }}
          >
            <div className="text-5xl mb-2">⛩️</div>
            <h2 className="text-2xl font-black mb-1" style={{ color: "#d4af37" }}>ゲームオーバー</h2>
            <p className="text-amber-400 text-sm mb-4">グリッドが埋まってしまいました</p>
            {isNewDailyBest && (
              <p className="text-amber-300 font-black text-sm mb-2">🏆 本日ベスト更新！</p>
            )}
            <div className="rounded-xl p-4 mb-4 space-y-2"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              {[
                ["スコア", state.score.toLocaleString()],
                ["本日ベスト", dailyBest.toLocaleString()],
                ["ベストスコア", state.bestScore.toLocaleString()],
                ["最高神社", `${highestShrine.emoji} ${highestShrine.name}`],
                ["御利益", highestShrine.goryaku],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-amber-400">{label}</span>
                  <span className="font-bold text-amber-100">{val}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <button
                onClick={handleRestart}
                className="w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f59e0b)",
                  color: "#1a0a00",
                  boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                }}
              >
                ⛩️ もう一度！
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-black hover:bg-gray-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                スコアをXでシェアして自慢する
              </a>
              {!isPremium && (
                <button
                  onClick={() => { setShowPayjp(true); }}
                  className="w-full py-2 text-xs text-amber-500 hover:text-amber-300 transition-colors"
                >
                  🙏 プレミアムで御利益アップ（¥480/月）
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 天照大神到達 花火セレブレーション */}
      {showAmaterasuCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          style={{ backdropFilter: "blur(4px)" }}>
          {/* 花火パーティクル CSS */}
          <style>{`
            @keyframes firework-1 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(-120px,-160px) scale(0); opacity: 0; }
            }
            @keyframes firework-2 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(130px,-140px) scale(0); opacity: 0; }
            }
            @keyframes firework-3 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(-80px,-200px) scale(0); opacity: 0; }
            }
            @keyframes firework-4 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(90px,-190px) scale(0); opacity: 0; }
            }
            @keyframes firework-5 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(-150px,-100px) scale(0); opacity: 0; }
            }
            @keyframes firework-6 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(160px,-80px) scale(0); opacity: 0; }
            }
            @keyframes firework-7 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(-60px,-220px) scale(0); opacity: 0; }
            }
            @keyframes firework-8 {
              0%   { transform: translate(0,0) scale(1); opacity: 1; }
              100% { transform: translate(70px,-215px) scale(0); opacity: 0; }
            }
            .particle { position: absolute; width: 10px; height: 10px; border-radius: 50%; }
            .p1 { background: #ffd700; animation: firework-1 1.2s ease-out infinite; }
            .p2 { background: #ff6b6b; animation: firework-2 1.1s ease-out infinite 0.1s; }
            .p3 { background: #a78bfa; animation: firework-3 1.3s ease-out infinite 0.2s; }
            .p4 { background: #34d399; animation: firework-4 1.0s ease-out infinite 0.15s; }
            .p5 { background: #fb923c; animation: firework-5 1.4s ease-out infinite 0.05s; }
            .p6 { background: #60a5fa; animation: firework-6 1.1s ease-out infinite 0.25s; }
            .p7 { background: #f472b6; animation: firework-7 1.2s ease-out infinite 0.1s; }
            .p8 { background: #facc15; animation: firework-8 1.3s ease-out infinite 0.3s; }
          `}</style>
          <div className="relative rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1a0a20, #2d1040, #0f0c29)",
              border: "2px solid rgba(212,175,55,0.6)",
              boxShadow: "0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15)",
            }}>
            {/* 花火パーティクル */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              <div className="relative">
                <div className="particle p1" />
                <div className="particle p2" />
                <div className="particle p3" />
                <div className="particle p4" />
                <div className="particle p5" />
                <div className="particle p6" />
                <div className="particle p7" />
                <div className="particle p8" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-6xl mb-2 animate-bounce">✨</div>
              <h2 className="text-2xl font-black mb-1"
                style={{ color: "#d4af37", textShadow: "0 0 20px rgba(212,175,55,0.8)" }}>
                天照大神に到達！
              </h2>
              <p className="text-amber-300 text-sm font-bold mb-1">神社マージコンプリート！</p>
              <p className="text-amber-500 text-xs mb-4 leading-relaxed">
                鳥居から最強の神へ。<br />あなたの御利益は「最強」です！
              </p>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("🎊 天照大神に到達しました！！神社マージコンプリート！✨ 鳥居から最強の神まで合体成功！ → https://shrine-merge.vercel.app #神社マージ #天照大神 #パズルゲーム")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm mb-3 transition-all active:scale-95"
                style={{ background: "#000" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                🎊 Xで達成を自慢する
              </a>
              <button
                onClick={() => setShowAmaterasuCelebration(false)}
                className="w-full py-2 text-sm font-bold rounded-xl transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00" }}
              >
                ゲームを続ける ⛩️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Komoju Payment Modal */}
      {showPayjp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl relative">
            <button
              onClick={() => setShowPayjp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <div className="text-4xl mb-3">⛩️</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">神社マージ プレミアム</h2>
            <p className="text-sm text-gray-500 mb-4">月額¥480で無制限プレイ・御利益2倍速</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-5 text-left">
              <li>✓ 無制限プレイ（1日3回制限なし）</li>
              <li>✓ 御利益ゲージ2倍速</li>
              <li>✓ 広告なし快適プレイ</li>
            </ul>
            <KomojuButton
              planId="standard"
              planLabel="¥480/月で始める"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
