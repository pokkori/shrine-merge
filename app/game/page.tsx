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
import ShrineCollection, { unlockShrine, getUnlockedShrines } from "@/components/ShrineCollection";
import {
  ToriiSmallIcon,
  BookIcon,
  MuteOnIcon,
  MuteOffIcon,
  StarIcon,
  BellIcon,
  OmikujiScrollIcon,
  RetryIcon,
  SakuraPetalSvg,
} from "@/components/UiSvgIcons";
import KonMascot from "@/components/KonMascot";
import SakuraParticleCanvas from "@/components/SakuraParticleCanvas";
import { ScorePopLayer, type ScorePopItem } from "@/components/ScorePop";
import { LottiePlayer } from "@/components/LottiePlayer";
import { StreakFlame } from "@/components/StreakFlame";

const DAILY_FREE_LIMIT = 3;
const AMATERASU_LEVEL = 9; // 天照大神のレベル

//  テキストグリッドシェア（Wordle方式）
const SHRINE_EMOJIS = ['[鳥]','[犬]','[水]','[拝]','[本]','[宮]','[社]','[総]','[照]'];

function generateEmojiGrid(highestLevel: number): string {
  const filled = SHRINE_EMOJIS.slice(0, highestLevel);
  const empty = Array(Math.max(0, 9 - highestLevel)).fill('　');
  const all = [...filled, ...empty];
  // 3列グリッド (3x3)
  const rows = [];
  for (let i = 0; i < 3; i++) {
    rows.push(all.slice(i * 3, i * 3 + 3).join(''));
  }
  return rows.join('\n');
}

//  合体演出レベル別テキスト
const MERGE_EFFECT_TEXTS: Record<number, { text: string; color: string; size: string }> = {
  2: { text: "縁起良し！", color: "#fb923c", size: "text-sm" },
  3: { text: "浄化！", color: "#fbbf24", size: "text-sm" },
  4: { text: "開運UP！御利益↑", color: "#4ade80", size: "text-base" },
  5: { text: "健康祈願！御利益UP！", color: "#38bdf8", size: "text-base" },
  6: { text: "金運上昇！御利益大！", color: "#a78bfa", size: "text-lg" },
  7: { text: "大吉！出世運爆上がり！", color: "#fcd34d", size: "text-lg" },
  8: { text: "万能御利益！最高運到来！", color: "#d4af37", size: "text-xl" },
  9: { text: "天照大神降臨！！大当たり！", color: "#fffbeb", size: "text-2xl" },
};

// 神社うんちくデータ（ゲームオーバー後にランダム表示）
const SHRINE_TRIVIA = [
  { shrine: "鳥居", fact: "鳥居は「神域」と「人間の世界」の境界を示す門。くぐることで心身が清められると言われています。" },
  { shrine: "狛犬", fact: "狛犬の「阿（あ）」「吽（うん）」は宇宙の始まりと終わりを表す。口を開けた方が『阿』、閉じた方が『吽』。" },
  { shrine: "手水舎", fact: "手水（てみず）で手を清めるのは古代から続く儀式。左手→右手→口→左手の順で清めるのが正式な作法。" },
  { shrine: "拝殿", fact: "拝殿は参拝者が礼拝するための建物。二礼二拍手一礼が一般的な参拝作法です。" },
  { shrine: "本殿", fact: "本殿は神様が宿る最も神聖な場所。一般参拝者は通常、本殿に入れません。" },
  { shrine: "神宮", fact: "「神宮」の称号は天皇・皇族を祀る最高格の社にのみ使われます。伊勢神宮が最も有名。" },
  { shrine: "大社", fact: "大社（たいしゃ）は神格が高い神社への称号。出雲大社や住吉大社などが代表的。縁結びで有名です。" },
  { shrine: "総本社", fact: "総本社は全国に分社する神社の「本家」。稲荷神社の総本社は京都の伏見稲荷大社です。" },
  { shrine: "天照大神", fact: "天照大神（あまてらすおおみかみ）は日本神話の最高神であり太陽の神。天皇家の祖先神とされています。" },
];

function getRandomTrivia(): typeof SHRINE_TRIVIA[0] {
  return SHRINE_TRIVIA[Math.floor(Math.random() * SHRINE_TRIVIA.length)];
}

//  ストリーク 

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

//  週次ランキング スコア保存 
function saveWeeklyBestScore(score: number): void {
  if (typeof window === "undefined") return;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekKey = weekStart.toISOString().slice(0, 10);
  const current = parseInt(localStorage.getItem(`shrine_weekly_best_${weekKey}`) ?? "0", 10);
  if (score > current) {
    localStorage.setItem(`shrine_weekly_best_${weekKey}`, String(score));
  }
}

//  デイリーチャレンジ (日付seed) 

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

//  デイリー無料おみくじ
type OmikujiResult = { rank: "大吉" | "中吉" | "小吉" | "凶"; emoji: string; message: string; goryaku: string; bonusLevel: number | null };
const OMIKUJI_RESULTS: OmikujiResult[] = [
  { rank: "大吉", emoji: "daikichi", message: "素晴らしい運気！今日は何をやっても上手くいく日。", goryaku: "金運・開運・縁結び すべて叶います", bonusLevel: 6 },
  { rank: "中吉", emoji: "chukichi", message: "良い運気に恵まれています。前向きに行動しましょう。", goryaku: "健康・出世・開運 がアップ", bonusLevel: 4 },
  { rank: "小吉", emoji: "shokichi", message: "小さな幸せが訪れる日。感謝の気持ちを大切に。", goryaku: "縁結び・浄化 に御利益あり", bonusLevel: 2 },
  { rank: "凶", emoji: "kyo", message: "今日は慎重に。焦らず、じっくり取り組むことで運気が開けます。", goryaku: "今日は休息日。明日から運気UP！", bonusLevel: null },
];
// 大吉:15%, 中吉:40%, 小吉:35%, 凶:10%
function drawOmikuji(): OmikujiResult {
  const r = Math.random();
  if (r < 0.15) return OMIKUJI_RESULTS[0]; // 大吉
  if (r < 0.55) return OMIKUJI_RESULTS[1]; // 中吉
  if (r < 0.90) return OMIKUJI_RESULTS[2]; // 小吉
  return OMIKUJI_RESULTS[3]; // 凶
}
function getDailyOmikujiStatus(): { drawn: boolean; result: OmikujiResult | null } {
  if (typeof window === "undefined") return { drawn: false, result: null };
  const today = new Date().toISOString().slice(0, 10);
  try {
    const data = JSON.parse(localStorage.getItem("shrine_daily_omikuji") ?? "{}");
    if (data.date === today) return { drawn: true, result: data.result ?? null };
  } catch { /* */ }
  return { drawn: false, result: null };
}
function saveDailyOmikuji(result: OmikujiResult): void {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem("shrine_daily_omikuji", JSON.stringify({ date: today, result }));
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

//  スコアカード Canvas生成 
function generateScoreCardDataURL(
  score: number,
  highestShrineName: string,
  highestShrineEmoji: string,
  bestScore: number
): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // 背景グラデーション
    const grad = ctx.createLinearGradient(0, 0, 480, 280);
    grad.addColorStop(0, "#1a0a20");
    grad.addColorStop(1, "#2d1040");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 480, 280);

    // ゴールドボーダー
    ctx.strokeStyle = "rgba(212,175,55,0.7)";
    ctx.lineWidth = 3;
    ctx.roundRect(6, 6, 468, 268, 16);
    ctx.stroke();

    // タイトル
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("神社マージ", 240, 52);

    // スコア
    ctx.fillStyle = "#fcd34d";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText(score.toLocaleString() + " pt", 240, 130);

    // 最高神社
    ctx.fillStyle = "#fde68a";
    ctx.font = "22px sans-serif";
    ctx.fillText(`最高神社: ${highestShrineName}`, 240, 175);

    // ベストスコア
    ctx.fillStyle = "rgba(212,175,55,0.7)";
    ctx.font = "16px sans-serif";
    ctx.fillText(`ベスト: ${bestScore.toLocaleString()} pt`, 240, 210);

    // URL
    ctx.fillStyle = "rgba(212,175,55,0.5)";
    ctx.font = "14px sans-serif";
    ctx.fillText("shrine-merge.vercel.app", 240, 252);

    return canvas.toDataURL("image/png");
  } catch {
    return "";
  }
}

async function shareScoreCard(
  score: number,
  highestShrineName: string,
  highestShrineEmoji: string,
  bestScore: number,
  scoreOmikuji: string,
  xShareUrl: string
): Promise<void> {
  const dataUrl = generateScoreCardDataURL(score, highestShrineName, highestShrineEmoji, bestScore);
  // Web Share API対応時は画像+テキストで共有
  if (dataUrl && navigator.share && navigator.canShare) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "shrine-merge-score.png", { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: `神社マージで${score.toLocaleString()}点達成！最高は${highestShrineName}まで合体させた #神社マージ`,
          url: "https://shrine-merge.vercel.app",
        });
        return;
      }
    } catch { /* fallthrough to X */ }
  }
  // フォールバック: Xシェア
  window.open(xShareUrl, "_blank", "noopener,noreferrer");
}

//  カウントダウンタイマー（FOMO用） 
function useSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  useEffect(() => {
    // 本日の残り時間を計算
    const calcTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      return `${h}:${m}:${s}`;
    };
    setTimeLeft(calcTimeLeft());
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

//  チュートリアルモーダル 
const TUTORIAL_STEPS = [
  { icon: "swipe", title: "スワイプで神社を動かす", desc: "画面を上下左右にスワイプ（またはキーボード矢印キー）すると、グリッド全体の神社が一斉に動きます。" },
  { icon: "merge", title: "同じ神社を合体させる", desc: "隣接した同じ種類の神社が自動で合体！より格の高い神社に昇格してスコアが上がります。" },
  { icon: "omikuji", title: "御利益ポイントを活用", desc: "神社があると御利益ポイントが自動で溜まります。おみくじを引くとボーナス神社が出現！大吉を狙え！" },
];

function getHasSeenTutorial(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("shrine_tutorial_seen") === "1";
}
function markTutorialSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("shrine_tutorial_seen", "1");
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
  const [dailyOmikujiDrawn, setDailyOmikujiDrawn] = useState(false);
  const [showOmikujiOverlay, setShowOmikujiOverlay] = useState(false);
  const [omikujiResult, setOmikujiResult] = useState<OmikujiResult | null>(null);
  const [omikujiRevealed, setOmikujiRevealed] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [collectionCount, setCollectionCount] = useState(0);
  const [showBonusEvent, setShowBonusEvent] = useState(false);
  const [bonusEventShrineLevel, setBonusEventShrineLevel] = useState(0);
  const [goryakuBuff, setGoryakuBuff] = useState(false);
  const [goryakuBuffEndTime, setGoryakuBuffEndTime] = useState(0);
  const [currentTrivia, setCurrentTrivia] = useState<typeof SHRINE_TRIVIA[0] | null>(null);
  const [showYayoiMode, setShowYayoiMode] = useState(false); // 八百万神モードバナー
  const [mergePopup, setMergePopup] = useState<{ text: string; color: string; size: string; key: number } | null>(null);
  const [showScreenFlash, setShowScreenFlash] = useState(false);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isMoving = useRef(false);
  const goryakuInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  // Lottieキャラ感情反応
  type LottieState = 'idle' | 'happy' | 'sad' | 'fever';
  const [lottieState, setLottieState] = useState<LottieState>('idle');
  // ScorePop
  const [scorePopItems, setScorePopItems] = useState<ScorePopItem[]>([]);
  const scorePopIdRef = useRef(0);
  const lastMergeAtRef = useRef(0);
  const comboCountRef = useRef(0);
  const saleCountdown = useSaleCountdown();
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
    // デイリーおみくじ状態初期化
    const omikujiStatus = getDailyOmikujiStatus();
    setDailyOmikujiDrawn(omikujiStatus.drawn);
    // コレクション数初期化
    setCollectionCount(getUnlockedShrines().length);
    // 初回チュートリアル
    if (!getHasSeenTutorial()) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (!state || state.isGameOver) return;
    const baseMultiplier = isPremium ? 2 : 1;
    goryakuInterval.current = setInterval(() => {
      const buffActive = Date.now() < goryakuBuffEndTime;
      const buffMultiplier = buffActive ? 2 : 1;
      setState(prev => {
        if (!prev || prev.isGameOver) return prev;
        const gain = calcGoryakuGain(prev.grid) * baseMultiplier * buffMultiplier;
        return { ...prev, goryakuPoints: prev.goryakuPoints + gain };
      });
    }, 1000);
    return () => {
      if (goryakuInterval.current) clearInterval(goryakuInterval.current);
    };
  }, [state?.isGameOver, isPremium, goryakuBuffEndTime]);

  const handleMove = useCallback((direction: Direction) => {
    if (isMoving.current) return;
    setState(prev => {
      if (!prev || prev.isGameOver) return prev;
      isMoving.current = true;
      const { grid: movedGrid, scoreGained, moved, highestMerged } = moveGrid(prev.grid, direction);
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
      // コレクション図鑑: 合成した最高レベルを解放
      if (highestLevel > prev.highestLevel) {
        unlockShrine(highestLevel);
        setTimeout(() => setCollectionCount(getUnlockedShrines().length), 0);
      }
      // ボーナスイベント: Lv7(大社)またはLv8(総本社)合成で御利益2倍バフ発動
      if (scoreGained > 0 && (highestLevel === 7 || highestLevel === 8)) {
        const now = Date.now();
        setTimeout(() => {
          setBonusEventShrineLevel(highestLevel);
          setShowBonusEvent(true);
          setGoryakuBuff(true);
          setGoryakuBuffEndTime(now + 60000); // 60秒バフ
          setTimeout(() => {
            setShowBonusEvent(false);
            setGoryakuBuff(false);
          }, 60000);
        }, 200);
      }
      if (scoreGained > 0) {
        // ScorePop発火
        const nowPop = Date.now();
        const isCombo = nowPop - lastMergeAtRef.current < 3000;
        comboCountRef.current = isCombo ? comboCountRef.current + 1 : 1;
        lastMergeAtRef.current = nowPop;
        const popId = ++scorePopIdRef.current;
        const comboSnap = comboCountRef.current;
        setTimeout(() => {
          setScorePopItems(sp => [
            ...sp,
            {
              id: popId,
              value: scoreGained,
              combo: comboSnap,
              x: window.innerWidth / 2,
              y: window.innerHeight * 0.4,
            },
          ]);
        }, 0);

        const mergeLevel = highestMerged > 0 ? highestMerged : getHighestLevel(newGrid);
        if (mergeLevel >= 6) {
          setTimeout(() => playSE("levelup"), 0);
        } else {
          setTimeout(() => playSE("merge"), 0);
        }
        setTimeout(() => playSE("score"), 80);
        // 合体演出ポップアップ
        if (mergeLevel >= 2 && MERGE_EFFECT_TEXTS[mergeLevel]) {
          const effect = MERGE_EFFECT_TEXTS[mergeLevel];
          setTimeout(() => {
            setMergePopup({ ...effect, key: Date.now() });
            setTimeout(() => setMergePopup(null), 1200);
          }, 0);
        }
        // レベル4以上: 画面フラッシュ
        if (mergeLevel >= 4) {
          setTimeout(() => {
            setShowScreenFlash(true);
            setTimeout(() => setShowScreenFlash(false), 700);
          }, 50);
        }
        // 天照大神: 花びら演出
        if (mergeLevel >= 9) {
          const newPetals = Array.from({ length: 18 }, (_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 100,
            delay: Math.random() * 1.5,
            duration: 2.5 + Math.random() * 2,
          }));
          setPetals(newPetals);
          setTimeout(() => setPetals([]), 5000);
        }
        // Lottieキャラ感情反応: レベル7以上→fever、それ以外→happy
        if (mergeLevel >= 7) {
          setLottieState('fever');
        } else {
          setLottieState('happy');
        }
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

  const handleDailyOmikuji = () => {
    if (dailyOmikujiDrawn) return;
    playSE("omikuji");
    setShowOmikujiOverlay(true);
    setOmikujiRevealed(false);
    // Reveal after animation delay
    setTimeout(() => {
      const result = drawOmikuji();
      setOmikujiResult(result);
      setOmikujiRevealed(true);
      saveDailyOmikuji(result);
      setDailyOmikujiDrawn(true);
      // Add bonus tile if result has bonusLevel
      if (result.bonusLevel !== null) {
        setState(prev => {
          if (!prev) return prev;
          // Add specific level cell
          const emptyCells: [number, number][] = [];
          for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
            if (!prev.grid[r][c]) emptyCells.push([r, c]);
          }
          if (emptyCells.length === 0) return prev;
          const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          const newGrid = prev.grid.map(row2 => [...row2]);
          newGrid[row][col] = { id: Date.now(), level: result.bonusLevel!, isNew: true };
          return { ...prev, grid: newGrid };
        });
      }
    }, 1200);
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
    // 週次ランキング保存
    saveWeeklyBestScore(state.score);
    // 到達した最高神社をすべて解放
    for (let lvl = 1; lvl <= state.highestLevel; lvl++) {
      unlockShrine(lvl);
    }
    setCollectionCount(getUnlockedShrines().length);
    // 神社うんちく表示
    setCurrentTrivia(getRandomTrivia());
    // 天照大神到達後に八百万神モードバナー
    if (state.highestLevel >= AMATERASU_LEVEL) {
      setShowYayoiMode(true);
    }
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
        <p className="text-amber-300 text-lg animate-pulse flex items-center gap-2">
          <ToriiSmallIcon size={24} />
          読み込み中...
        </p>
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
  // スコアに応じたおみくじ結果
  const scoreOmikuji = state.score >= 5000 ? "大吉" : state.score >= 3000 ? "中吉" : state.score >= 2000 ? "吉" : state.score >= 1000 ? "小吉" : "末吉";
  const emojiGrid = generateEmojiGrid(state.highestLevel);
  const emojiShareMsg = `神社マージ 今日の記録\n${emojiGrid}\n最高: ${highestShrine.name}（Lv.${state.highestLevel}）\nhttps://shrine-merge.vercel.app #神社マージ`;
  const emojiShareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(emojiShareMsg);
  const shareMsg = `【神社マージ】${state.score.toLocaleString()}点で${scoreOmikuji} ${shrineTopPercent}の参拝力！最高神社「${highestShrine.name}」(${highestShrine.goryaku}) あなたは天照大神まで辿り着ける？ → https://shrine-merge.vercel.app #神社マージ #おみくじ #パズルゲーム`;
  const shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareMsg);
  const remainingPlays = isPremium ? null : Math.max(0, DAILY_FREE_LIMIT - dailyPlays);
  const dailyChallengeProgress = Math.min(100, Math.round((dailyChallenge.best / dailyChallenge.target) * 100));

  return (
    <div
      className="starry-bg min-h-screen flex flex-col items-center justify-start py-4 px-3"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 流れ星 */}
      <div className="shooting-star-base shooting-star-1" aria-hidden="true" />
      <div className="shooting-star-base shooting-star-2" aria-hidden="true" />
      <div className="shooting-star-base shooting-star-3" aria-hidden="true" />

      {/* ScorePopLayer: fixed overlay */}
      <ScorePopLayer
        items={scorePopItems}
        onRemove={id => setScorePopItems(prev => prev.filter(p => p.id !== id))}
      />

      {/* 画面フラッシュ演出 */}
      {showScreenFlash && <div className="screen-flash" />}

      {/* Lottieキャラ感情反応アニメーション */}
      <LottiePlayer
        state={lottieState}
        onComplete={() => setLottieState('idle')}
      />

      {/* 花びら降下演出（天照大神） Canvas版 */}
      <SakuraParticleCanvas active={petals.length > 0} intensity="heavy" duration={5000} />
      {/* 旧petal div は SakuraParticleCanvas に統合 */}

      {/* 合体演出ポップアップ */}
      {mergePopup && (
        <div
          key={mergePopup.key}
          className={`merge-popup ${mergePopup.size} font-black`}
          style={{
            color: mergePopup.color,
            top: "38%",
            fontSize: mergePopup.size === "text-2xl" ? "1.5rem" : mergePopup.size === "text-xl" ? "1.25rem" : mergePopup.size === "text-lg" ? "1.125rem" : mergePopup.size === "text-base" ? "1rem" : "0.875rem",
          }}
        >
          {mergePopup.text}
        </div>
      )}

      {/* ストリークバナー */}
      {showStreakBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-6 py-3 rounded-2xl font-black text-lg shadow-2xl animate-bounce flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00", boxShadow: "0 0 30px rgba(212,175,55,0.7)" }}>
            <StarIcon size={20} />
            {shrineStreak}日連続参拝！御利益UP！
          </div>
        </div>
      )}

      {/* デイリーチャレンジバー */}
      <div className="w-full max-w-sm px-1 pt-1 mb-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: "#d4af37" }}>
            <BellIcon size={12} />
            今日のお告げ {dailyChallenge.cleared ? "達成！" : `目標: ${dailyChallenge.target.toLocaleString()}pt`}
          </span>
          {shrineStreak >= 1 && (
            <StreakFlame streak={shrineStreak} />
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
        <h1 className="text-xl font-black flex items-center gap-1.5" style={{ color: "#d4af37", textShadow: "0 0 12px rgba(212,175,55,0.5)" }}>
          <ToriiSmallIcon size={22} />
          神社マージ
        </h1>
        <div className="flex items-center gap-2">
          {/* 図鑑ボタン */}
          <button
            onClick={() => setShowCollection(true)}
            className="relative flex items-center justify-center"
            style={{ width: 44, height: 44 }}
            aria-label="神様図鑑"
            title="神様図鑑"
          >
            <BookIcon size={24} />
            {collectionCount > 0 && (
              <span className="absolute top-0.5 right-0.5 text-[9px] font-black px-1 rounded-full"
                style={{ background: "#d4af37", color: "#1a0a00", minWidth: "14px", lineHeight: "14px", textAlign: "center" }}>
                {collectionCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center justify-center"
            style={{ width: 44, height: 44 }}
            aria-label={isMuted ? "ミュート解除" : "ミュート"}
          >
            {isMuted ? <MuteOffIcon size={24} /> : <MuteOnIcon size={24} />}
          </button>
          <button
            onClick={() => { playSE("button"); handleRestart(); }}
            aria-label="ゲームをリセットする"
            className="text-xs px-3 py-1 rounded-lg font-bold transition-all active:scale-95"
            style={{ background: "rgba(212,175,55,0.2)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)" }}
          >
            リセット
          </button>
        </div>
      </div>

      {/* ボーナスイベントバナー */}
      {showBonusEvent && (
        <div className="w-full max-w-sm mb-2">
          <div className="rounded-xl px-4 py-2 text-center animate-bounce"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(245,158,11,0.2))",
              border: "1px solid rgba(212,175,55,0.6)",
              boxShadow: "0 0 16px rgba(212,175,55,0.4)",
            }}>
            <p className="text-sm font-black flex items-center justify-center gap-1.5" style={{ color: "#fcd34d" }}>
              <StarIcon size={16} />
              {SHRINES[bonusEventShrineLevel - 1]?.name}合成！御利益2倍バフ発動中！
            </p>
            <p className="text-xs text-amber-400">60秒間 御利益ポイント獲得量2倍</p>
          </div>
        </div>
      )}
      {/* 御利益バフ中インジケーター */}
      {goryakuBuff && !showBonusEvent && (
        <div className="w-full max-w-sm mb-2">
          <div className="rounded-lg px-3 py-1 text-center"
            style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
            <p className="text-xs font-bold flex items-center justify-center gap-1" style={{ color: "#fcd34d" }}>
              <StarIcon size={12} /> 御利益2倍バフ発動中
            </p>
          </div>
        </div>
      )}

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

      {/* 残り1回ゴールド警告バナー */}
      {!isPremium && premiumChecked && remainingPlays === 1 && (
        <div className="w-full max-w-sm mb-2">
          <div className="rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(245,158,11,0.15))",
              border: "2px solid rgba(212,175,55,0.7)",
              boxShadow: "0 0 16px rgba(212,175,55,0.3)",
            }}>
            <div>
              <p className="text-xs font-black flex items-center gap-1" style={{ color: "#fcd34d" }}>
                <ToriiSmallIcon size={14} /> 本日の参拝はあと1回！
              </p>
              <p className="text-xs" style={{ color: "rgba(212,175,55,0.7)" }}>プレミアムで明日も無制限参拝</p>
            </div>
            <button
              onClick={() => setShowPayjp(true)}
              aria-label="月額プランに登録する"
              className="text-xs font-black px-3 py-1.5 rounded-lg transition-all active:scale-95 shrink-0"
              style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00" }}
            >
              ¥480/月
            </button>
          </div>
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
        <ToriiSmallIcon size={20} />
        <span className="text-sm font-bold text-amber-200">{highestShrine.name}</span>
        <span className="text-xs text-amber-500 ml-auto">御利益: {highestShrine.goryaku}</span>
      </div>

      <div className="w-full max-w-sm mb-4">
        <ShrineGrid grid={state.grid} />
      </div>
      <div className="w-full max-w-sm mb-2 space-y-2">
        {/* デイリー無料おみくじ */}
        <button
          onClick={handleDailyOmikuji}
          disabled={dailyOmikujiDrawn}
          aria-label="デイリーおみくじを引く"
          className={`w-full py-3 rounded-xl font-black text-base transition-all active:scale-95 ${!dailyOmikujiDrawn ? "btn-gold" : ""}`}
          style={dailyOmikujiDrawn
            ? { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", cursor: "not-allowed" }
            : { boxShadow: "0 0 20px rgba(212,175,55,0.5)" }
          }
        >
          <span className="flex items-center justify-center gap-2">
            <OmikujiScrollIcon size={20} />
            {dailyOmikujiDrawn ? "今日のおみくじは引きました" : "今日のおみくじ（毎日1回・無料）"}
          </span>
        </button>
        {/* 御利益おみくじ */}
        <button
          onClick={handleOmikuji}
          disabled={state.goryakuPoints < OMIKUJI_COST}
          aria-label="御利益おみくじを引く"
          className={`w-full py-3 rounded-xl font-black text-base transition-all active:scale-95 ${
            state.goryakuPoints >= OMIKUJI_COST ? "btn-gold" : ""
          }`}
          style={state.goryakuPoints < OMIKUJI_COST
            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", cursor: "not-allowed" }
            : {}
          }
        >
          <span className="flex items-center justify-center gap-2">
            <OmikujiScrollIcon size={20} />
            おみくじを引く（御利益 {OMIKUJI_COST}pt）
          </span>
        </button>
        <p className="text-center text-xs text-amber-600">
          おみくじでグリッドにランダムな神社が出現します
        </p>
      </div>

      {/* デイリーおみくじ オーバーレイ */}
      {showOmikujiOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => omikujiRevealed && setShowOmikujiOverlay(false)}>
          <div className="relative w-72 rounded-3xl p-8 text-center shadow-2xl"
            style={{ background: "linear-gradient(160deg, #1a0a00, #2d1800)", border: "2px solid rgba(212,175,55,0.6)", boxShadow: "0 0 60px rgba(212,175,55,0.3)" }}>
            {!omikujiRevealed ? (
              <div className="py-4">
                <div className="mb-4 flex justify-center" style={{ animation: "kon-spin 0.8s linear infinite" }}>
                  <OmikujiScrollIcon size={64} />
                </div>
                <p className="text-amber-300 font-bold text-lg animate-pulse">おみくじを引いています…</p>
              </div>
            ) : omikujiResult && (
              <>
                {/* 大吉専用: 桜の花びらCanvas */}
                {omikujiResult.rank === "大吉" && (
                  <>
                    <style>{`
                      @keyframes omikuji-petal-fall {
                        0% { transform: translateY(-30px) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(320px) rotate(720deg); opacity: 0; }
                      }
                      .omikuji-petal-svg {
                        position: absolute;
                        pointer-events: none;
                        z-index: 0;
                        animation: omikuji-petal-fall linear infinite;
                      }
                      @keyframes gold-glow-pulse {
                        0%, 100% { text-shadow: 0 0 30px rgba(252,211,77,0.8), 0 0 60px rgba(212,175,55,0.5); }
                        50% { text-shadow: 0 0 50px rgba(252,211,77,1), 0 0 80px rgba(212,175,55,0.8), 0 0 120px rgba(255,200,0,0.4); }
                      }
                    `}</style>
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={`omikuji-petal-${i}`}
                        className="omikuji-petal-svg"
                        style={{
                          left: `${8 + (i * 7) % 84}%`,
                          animationDuration: `${2 + (i * 0.17) % 2}s`,
                          animationDelay: `${(i * 0.13) % 1.5}s`,
                        }}
                      >
                        <SakuraPetalSvg size={18} />
                      </div>
                    ))}
                  </>
                )}
                <div className="relative z-10">
                {/* ランク別SVGアイコン */}
                <div className="mb-2 flex justify-center animate-bounce">
                  {omikujiResult.rank === "大吉" && <KonMascot pose="excited" size={72} />}
                  {omikujiResult.rank === "中吉" && <KonMascot pose="happy" size={64} />}
                  {omikujiResult.rank === "小吉" && <KonMascot pose="idle" size={60} />}
                  {omikujiResult.rank === "凶" && <KonMascot pose="sad" size={60} />}
                </div>
                <div className="text-5xl font-black mb-3" style={{
                  color: omikujiResult.rank === "大吉" ? "#fcd34d" : omikujiResult.rank === "中吉" ? "#86efac" : omikujiResult.rank === "小吉" ? "#93c5fd" : "#9ca3af",
                  textShadow: omikujiResult.rank === "大吉" ? "0 0 30px rgba(252,211,77,0.8)" : "none",
                  animation: omikujiResult.rank === "大吉" ? "gold-glow-pulse 1.5s ease-in-out infinite" : "none",
                }}>
                  {omikujiResult.rank}
                </div>
                {omikujiResult.rank === "大吉" && (
                  <p className="text-xs font-black mb-2 animate-pulse" style={{ color: "#fcd34d" }}>
                    天照大神まで一歩近づく神社が出現！
                  </p>
                )}
                <p className="text-amber-200 text-sm mb-2 leading-relaxed">{omikujiResult.message}</p>
                <div className="bg-amber-900/30 rounded-xl p-3 mb-4 border border-amber-700/30">
                  <p className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <ToriiSmallIcon size={12} /> 御利益
                  </p>
                  <p className="text-xs text-amber-300 mt-1">{omikujiResult.goryaku}</p>
                </div>
                {omikujiResult.bonusLevel && (
                  <div className="bg-green-900/30 rounded-xl p-2 mb-4 border border-green-700/30">
                    <p className="text-xs text-green-400 font-bold">ボーナスタイル「{SHRINES[omikujiResult.bonusLevel - 1]?.name}」が出現！</p>
                  </div>
                )}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`神社マージのおみくじで${omikujiResult.rank}が出た！ ${omikujiResult.goryaku} #神社マージ #おみくじ → https://shrine-merge.vercel.app`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm mb-2 transition-all active:scale-95"
                  style={{ background: "#000" }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  {omikujiResult.rank}をXでシェア
                </a>
                <button
                  onClick={() => setShowOmikujiOverlay(false)}
                  aria-label="おみくじを閉じて参拝を続ける"
                  className="w-full py-3 rounded-xl font-black text-amber-900 text-base transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)" }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ToriiSmallIcon size={18} />
                    参拝を続ける
                  </span>
                </button>
                <p className="text-xs text-amber-800 mt-2">明日またおみくじが引けます</p>
                </div>{/* close relative z-10 */}
              </>
            )}
          </div>
        </div>
      )}

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
            className="backdrop-blur-md rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(26,10,32,0.95), rgba(45,16,64,0.95))",
              border: "1px solid rgba(212,175,55,0.4)",
              boxShadow: "0 0 40px rgba(212,175,55,0.2)",
            }}
          >
            {/*  期間限定セールバナー */}
            <div className="rounded-xl px-3 py-2 mb-3 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.15))",
                border: "1px solid rgba(239,68,68,0.5)",
                boxShadow: "0 0 12px rgba(239,68,68,0.2)",
              }}>
              <p className="text-xs font-black" style={{ color: "#fca5a5" }}>期間限定 50%OFFキャンペーン中！</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(252,165,165,0.7)" }}>
                終了まで{" "}
                <span className="font-black tabular-nums" style={{ color: "#f87171" }}>{saleCountdown}</span>
              </p>
            </div>
            <div className="mb-2 flex justify-center">
              <ToriiSmallIcon size={48} />
            </div>
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
                <span className="text-base line-through" style={{ color: "rgba(212,175,55,0.5)" }}>通常¥980</span>
                <span className="text-sm text-red-400 font-bold ml-2">→ 今すぐ</span>
                <br />
                <span className="text-3xl font-black" style={{ color: "#d4af37" }}>&#165;490</span>
                <span className="text-amber-400 text-sm">/月</span>
                <p className="text-xs font-black mt-1" style={{ color: "#fca5a5" }}>今日だけの特別価格</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setShowPaywall(false); setShowPayjp(true); }}
                aria-label="プレミアムプランに50%OFFで登録する"
                className="w-full py-3 rounded-xl font-black text-base transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f59e0b)",
                  color: "#1a0a00",
                  boxShadow: "0 0 16px rgba(212,175,55,0.4)",
                }}
              >
                50%OFFで今すぐ始める
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                aria-label="ペイウォールを閉じて明日また遊ぶ"
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
            className="backdrop-blur-md rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(26,10,32,0.95), rgba(45,16,64,0.95))",
              border: "1px solid rgba(212,175,55,0.4)",
              boxShadow: "0 0 40px rgba(212,175,55,0.2)",
            }}
          >
            <div className="mb-2 flex justify-center">
              <KonMascot pose="sad" size={64} />
            </div>
            <h2 className="text-2xl font-black mb-1" style={{ color: "#d4af37" }}>ゲームオーバー</h2>
            <p className="text-amber-400 text-sm mb-2">グリッドが埋まってしまいました</p>
            {/* ニアミス演出 */}
            {state.bestScore - state.score > 0 && state.bestScore - state.score <= 500 && (
              <div className="rounded-xl px-3 py-2 mb-3 animate-pulse"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,158,11,0.1))",
                  border: "1px solid rgba(212,175,55,0.5)",
                }}>
                <p className="text-xs font-black" style={{ color: "#fcd34d" }}>
                  あと{(state.bestScore - state.score).toLocaleString()}pt でベスト更新！
                </p>
              </div>
            )}
            {isNewDailyBest && (
              <p className="text-amber-300 font-black text-sm mb-2 flex items-center justify-center gap-1">
                <StarIcon size={14} /> 本日ベスト更新！
              </p>
            )}
            <div className="rounded-xl p-4 mb-4 space-y-2"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              {[
                ["スコア", state.score.toLocaleString()],
                ["本日ベスト", dailyBest.toLocaleString()],
                ["ベストスコア", state.bestScore.toLocaleString()],
                ["最高神社", highestShrine.name],
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
                aria-label="もう一度ゲームをプレイする"
                className="w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f59e0b)",
                  color: "#1a0a00",
                  boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                }}
              >
                <RetryIcon size={22} />
                もう一度！
              </button>
              {/* テキストグリッドシェア（Wordle方式） */}
              <a
                href={emojiShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(245,158,11,0.15))",
                  border: "1px solid rgba(212,175,55,0.6)",
                  color: "#fcd34d",
                }}
              >
                グリッドでシェア
              </a>
              {/* スコアカードシェアボタン */}
              <button
                onClick={() => shareScoreCard(
                  state.score,
                  highestShrine.name,
                  highestShrine.emoji,
                  state.bestScore,
                  scoreOmikuji,
                  shareUrl
                )}
                aria-label="スコアカード画像をシェアする"
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(245,158,11,0.15))",
                  border: "1px solid rgba(212,175,55,0.5)",
                  color: "#fcd34d",
                }}
              >
                スコアカードをシェア
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
                {scoreOmikuji} {state.score.toLocaleString()}点をXでシェア
              </a>
              <a
                href="/ranking"
                className="w-full py-2 text-xs text-amber-400 hover:text-amber-200 transition-colors flex items-center justify-center gap-1"
              >
                週次ランキングを確認
              </a>
              <button
                onClick={() => setShowCollection(true)}
                aria-label={`神様図鑑を開く（${collectionCount}/${SHRINES.length}体解放済み）`}
                className="w-full py-2 text-xs text-amber-400 hover:text-amber-200 transition-colors flex items-center justify-center gap-1"
              >
                <BookIcon size={14} />
                神様図鑑を見る（{collectionCount}/{SHRINES.length}体解放済み）
              </button>
              {!isPremium && (
                <button
                  onClick={() => { setShowPayjp(true); }}
                  aria-label="プレミアムプランで御利益アップする（月額480円）"
                  className="w-full py-2 text-xs text-amber-500 hover:text-amber-300 transition-colors"
                >
                  プレミアムで御利益アップ（¥480/月）
                </button>
              )}
              {/* 神社うんちく */}
              {currentTrivia && (
                <div className="mt-3 rounded-xl p-3 text-left"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
                  <p className="text-xs font-bold mb-1 flex items-center gap-1" style={{ color: "#d4af37" }}>
                    <ToriiSmallIcon size={12} /> 神社豆知識 — {currentTrivia.shrine}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(253,230,138,0.75)" }}>{currentTrivia.fact}</p>
                </div>
              )}
              {/* 八百万神モードバナー */}
              {showYayoiMode && (
                <div className="mt-3 rounded-xl p-3 text-center animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(252,211,77,0.08))",
                    border: "1px solid rgba(212,175,55,0.5)",
                  }}>
                  <p className="text-xs font-black mb-1 flex items-center justify-center gap-1" style={{ color: "#fcd34d" }}>
                    <StarIcon size={12} /> 天照大神到達者限定 — 八百万神モード解放！
                  </p>
                  <p className="text-xs" style={{ color: "rgba(212,175,55,0.7)" }}>全9神を解放したあなたへ。さらに高みを目指してスコアの限界に挑もう！</p>
                  <p className="text-xs mt-1 font-bold" style={{ color: "#f59e0b" }}>新記録まで: あと {Math.max(0, (state.bestScore || 0) + 1000 - state.score).toLocaleString()} pt</p>
                </div>
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
          <div className="relative rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl overflow-hidden amaterasu-modal-inner"
            style={{
              background: "linear-gradient(160deg, #1a0800, #3d2000, #1a0a20)",
              border: "2px solid rgba(212,175,55,0.8)",
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
              <div className="mb-3 flex justify-center" style={{ filter: "drop-shadow(0 0 16px rgba(255,200,0,0.9))" }}>
                <KonMascot pose="excited" size={80} />
              </div>
              <h2 className="text-3xl font-black mb-1"
                style={{ color: "#fcd34d", textShadow: "0 0 30px rgba(255,200,0,1), 0 0 60px rgba(212,175,55,0.6)" }}>
                天照大神 降臨！
              </h2>
              <p className="text-amber-200 text-base font-black mb-1">神社マージ コンプリート！</p>
              <p className="text-amber-400 text-sm mb-1">鳥居から最強の神まで到達！</p>
              <div className="rounded-xl p-2 mb-4 mt-2"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}>
                <p className="text-xs font-bold" style={{ color: "#fcd34d" }}>
                  スコア: {state.score.toLocaleString()} pt
                </p>
                <p className="text-xs text-amber-400 mt-1">御利益: 最強 — すべての願いが叶う</p>
              </div>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`天照大神に到達！！神社マージコンプリート！\n${emojiGrid}\nLv.9 天照大神（御利益：最強）\n${state.score.toLocaleString()}pt 達成！\nhttps://shrine-merge.vercel.app #神社マージ #天照大神`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm mb-3 transition-all active:scale-95"
                style={{ background: "#000" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                グリッドでXシェア
              </a>
              <button
                onClick={() => setShowAmaterasuCelebration(false)}
                aria-label="天照大神セレブレーションを閉じてゲームを続ける"
                className="w-full py-2 text-sm font-bold rounded-xl transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <ToriiSmallIcon size={16} />
                  ゲームを続ける
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 神様コレクション図鑑 */}
      {showCollection && (
        <ShrineCollection onClose={() => setShowCollection(false)} />
      )}

      {/* 初心者チュートリアルモーダル */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-xs rounded-3xl p-7 text-center shadow-2xl"
            style={{ background: "linear-gradient(160deg, #1a0a00, #2d1800)", border: "2px solid rgba(212,175,55,0.6)", boxShadow: "0 0 60px rgba(212,175,55,0.3)" }}>
            <div className="mb-3 flex justify-center">
              {TUTORIAL_STEPS[tutorialStep].icon === "swipe" && <ToriiSmallIcon size={48} />}
              {TUTORIAL_STEPS[tutorialStep].icon === "merge" && <StarIcon size={48} />}
              {TUTORIAL_STEPS[tutorialStep].icon === "omikuji" && <OmikujiScrollIcon size={48} />}
            </div>
            <h2 className="text-lg font-black mb-2" style={{ color: "#d4af37" }}>
              {tutorialStep + 1}/{TUTORIAL_STEPS.length}｜{TUTORIAL_STEPS[tutorialStep].title}
            </h2>
            <p className="text-sm text-amber-200 leading-relaxed mb-6">
              {TUTORIAL_STEPS[tutorialStep].desc}
            </p>
            <div className="flex gap-2 justify-center mb-3">
              {TUTORIAL_STEPS.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: i <= tutorialStep ? "#d4af37" : "rgba(212,175,55,0.25)" }} />
              ))}
            </div>
            {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={() => setTutorialStep(s => s + 1)}
                aria-label={`チュートリアル次のステップへ（${tutorialStep + 2}/${TUTORIAL_STEPS.length}）`}
                className="w-full py-3 rounded-xl font-black text-base transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00" }}
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={() => { markTutorialSeen(); setShowTutorial(false); }}
                aria-label="チュートリアルを完了してゲームをスタートする"
                className="w-full py-3 rounded-xl font-black text-base transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #d4af37, #f59e0b)", color: "#1a0a00" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <ToriiSmallIcon size={18} />
                  ゲームスタート！
                </span>
              </button>
            )}
            <button
              onClick={() => { markTutorialSeen(); setShowTutorial(false); }}
              aria-label="チュートリアルをスキップしてゲームを始める"
              className="mt-2 text-xs text-amber-700 hover:text-amber-500 transition-colors"
            >
              スキップ
            </button>
          </div>
        </div>
      )}

      {/* Komoju Payment Modal */}
      {showPayjp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl relative">
            <button
              onClick={() => setShowPayjp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
              aria-label="閉じる"
            >
              &#215;
            </button>
            <div className="mb-3 flex justify-center">
              <ToriiSmallIcon size={48} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">神社マージ プレミアム</h2>
            <p className="text-sm text-gray-500 mb-4">月額¥480で無制限プレイ・御利益2倍速</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-5 text-left">
              <li>&#10003; 無制限プレイ（1日3回制限なし）</li>
              <li>&#10003; 御利益ゲージ2倍速</li>
              <li>&#10003; 広告なし快適プレイ</li>
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
