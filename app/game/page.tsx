"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ShrineGrid from "@/components/ShrineGrid";
import ScoreBoard from "@/components/ScoreBoard";
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

export default function GamePage() {
  const [state, setState] = useState<GameState | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isMoving = useRef(false);
  const goryakuInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { startBGM, playSE, toggleMute, isMuted } = useGameAudio();

  useEffect(() => {
    const best = loadBestScore();
    setState(initGame(best));
  }, []);

  useEffect(() => {
    if (!state || state.isGameOver) return;
    goryakuInterval.current = setInterval(() => {
      setState(prev => {
        if (!prev || prev.isGameOver) return prev;
        const gain = calcGoryakuGain(prev.grid);
        return { ...prev, goryakuPoints: prev.goryakuPoints + gain };
      });
    }, 1000);
    return () => {
      if (goryakuInterval.current) clearInterval(goryakuInterval.current);
    };
  }, [state?.isGameOver]);
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

  const handleRestart = () => {
    if (goryakuInterval.current) clearInterval(goryakuInterval.current);
    const best = loadBestScore();
    setState(initGame(best));
  };

  if (!state) {
    return (
      <div className="starry-bg min-h-screen flex items-center justify-center">
        <p className="text-amber-300 text-lg animate-pulse">⛩️ 読み込み中...</p>
      </div>
    );
  }

  const highestShrine = SHRINES[state.highestLevel - 1];
  const shareMsg = `⛩️神社マージでスコア${state.score.toLocaleString()}達成!\n最高レベル: ${highestShrine.name}「${highestShrine.goryaku}」\n\n#神社マージ #shrinemerge\nあなたも試す→ https://shrine-merge.vercel.app`;
  const shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareMsg);

  return (
    <div
      className="starry-bg min-h-screen flex flex-col items-center justify-start py-4 px-3"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-sm mx-auto flex items-center justify-between mb-3">
        <a href="/" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">← トップ</a>
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
          ← → ↑ ↓ キー または スワイプで操作 ／ 同じ神社を合わせてマージ！
        </p>
      </div>

      {state.isGameOver && (
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
            <div className="rounded-xl p-4 mb-4 space-y-2"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              {[
                ["スコア", state.score.toLocaleString()],
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
                className="btn-shrine-red w-full py-3 text-base"
              >
                もう一度プレイ
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                style={{ background: "#1a1a1a", display: "flex" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Xでシェア
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
