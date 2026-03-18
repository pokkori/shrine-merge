"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#d4af37", "#f59e0b", "#ef4444", "#22c55e", "#8b5cf6", "#06b6d4"];
    const ps = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    // Komoju session verify
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      fetch(`/api/komoju/verify?session_id=${sessionId}`).catch(() => {});
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4">⛩️</div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "#d4af37" }}>プレミアム会員へようこそ！</h1>
          <p className="text-amber-400">神社マージのフル機能が解放されました</p>
        </div>

        <div className="rounded-2xl p-6 mb-8"
          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)" }}>
          <h2 className="font-bold text-amber-200 mb-3 text-sm">あなたの特典</h2>
          <ul className="space-y-2 text-sm text-amber-300">
            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span>1日のプレイ回数が無制限</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span>全ての神社がアンロック</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span>御利益ポイントのブースト（2倍速）</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#10003;</span>広告なしでプレイ</li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-amber-200 text-center text-sm">さっそくプレイ！</h2>

          <Link href="/game" className="flex items-center gap-4 rounded-xl p-4 transition-all group"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: "linear-gradient(135deg, #7f0000, #c0392b)", color: "#fff" }}>1</div>
            <div className="flex-1">
              <p className="font-bold text-amber-200 text-sm">無制限で神社をマージ！</p>
              <p className="text-xs text-amber-500">1日のプレイ制限なしで遊べます</p>
            </div>
            <span className="text-amber-600 group-hover:text-amber-300 transition-colors">&#8594;</span>
          </Link>

          <Link href="/game" className="flex items-center gap-4 rounded-xl p-4 transition-all group"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: "linear-gradient(135deg, #7f0000, #c0392b)", color: "#fff" }}>2</div>
            <div className="flex-1">
              <p className="font-bold text-amber-200 text-sm">天照大神を目指そう</p>
              <p className="text-xs text-amber-500">最高レベルの神社に到達しよう</p>
            </div>
            <span className="text-amber-600 group-hover:text-amber-300 transition-colors">&#8594;</span>
          </Link>

          <Link href="/game" className="flex items-center gap-4 rounded-xl p-4 transition-all group"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: "linear-gradient(135deg, #7f0000, #c0392b)", color: "#fff" }}>3</div>
            <div className="flex-1">
              <p className="font-bold text-amber-200 text-sm">Xでスコアをシェア</p>
              <p className="text-xs text-amber-500">友達と競い合おう</p>
            </div>
            <span className="text-amber-600 group-hover:text-amber-300 transition-colors">&#8594;</span>
          </Link>
        </div>

        <div className="text-center rounded-xl p-4 mb-6"
          style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <p className="text-xs text-amber-600 mb-1">ゲームをブックマークしておきましょう</p>
          <p className="text-sm font-bold text-amber-300">いつでもすぐにプレイできます</p>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="starry-bg min-h-screen flex items-center justify-center py-12">
      <Suspense fallback={<div className="text-center text-amber-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
