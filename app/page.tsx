import Link from "next/link";
import Image from "next/image";
import { SHRINES } from "@/lib/game";
import ShrineStreakBadge from "@/components/ShrineStreakBadge";
import DailyOmikujiTeaser from "@/components/DailyOmikujiTeaser";
import MergeDemoSection from "@/components/MergeDemoSection";

/* --- SVG Icons (replaces all emoji) --- */
function ToriiSvg({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <rect x="6" y="8" width="36" height="5" rx="2" fill="#B91C1C" />
      <rect x="4" y="12" width="40" height="3" rx="1" fill="#DC2626" />
      <rect x="10" y="15" width="4" height="30" rx="1" fill="#991B1B" />
      <rect x="34" y="15" width="4" height="30" rx="1" fill="#991B1B" />
      <rect x="8" y="22" width="32" height="3" rx="1" fill="#B91C1C" />
    </svg>
  );
}
function EnMusubiSvg() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden="true">
      <circle cx="10" cy="16" r="7" fill="none" stroke="#F472B6" strokeWidth="2.5" />
      <circle cx="22" cy="16" r="7" fill="none" stroke="#F472B6" strokeWidth="2.5" />
      <path d="M13 12 C16 8 16 24 19 20" stroke="#F472B6" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
function KinunSvg() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#FBBF24" />
      <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400E">$</text>
    </svg>
  );
}
function GakugyoSvg() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden="true">
      <rect x="6" y="8" width="20" height="16" rx="2" fill="#3B82F6" />
      <rect x="8" y="10" width="16" height="12" rx="1" fill="#DBEAFE" />
      <path d="M10 14h12M10 18h8" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="24" width="8" height="3" rx="1" fill="#60A5FA" />
    </svg>
  );
}
function KenkouSvg() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden="true">
      <path d="M16 6 C10 6 4 12 4 18 C4 24 10 28 16 28 C22 28 28 24 28 18 C28 12 22 6 16 6Z" fill="#10B981" />
      <path d="M12 16h8M16 12v8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function ShoubuSvg() {
  return (
    <svg viewBox="0 0 32 32" width={28} height={28} aria-hidden="true">
      <polygon points="16,2 20,12 31,12 22,19 25,30 16,23 7,30 10,19 1,12 12,12" fill="#EF4444" />
    </svg>
  );
}
function SwipeSvg() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} aria-hidden="true">
      <path d="M8 16h16M20 12l4 4-4 4" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function MergeSvg() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} aria-hidden="true">
      <circle cx="10" cy="16" r="6" fill="#D4AF37" opacity="0.7" />
      <circle cx="22" cy="16" r="6" fill="#D4AF37" opacity="0.7" />
      <path d="M14 16h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function GoryakuSvg() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="none" stroke="#FBBF24" strokeWidth="2" />
      <path d="M16 8v10l6 4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function OmikujiSvg() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} aria-hidden="true">
      <rect x="10" y="4" width="12" height="24" rx="2" fill="#FEF3C7" />
      <rect x="12" y="6" width="8" height="4" rx="1" fill="#DC2626" />
      <path d="M14 14h4M14 18h4" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function StarSvg({ filled = true, size = 14 }: { filled?: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? "#fcd34d" : "rgba(212,175,55,0.25)"} />
    </svg>
  );
}

/* --- Floating particles --- */
function FloatingParticles() {
  const particles = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    left: `${10 + i * 13}%`,
    delay: `${i * 0.7}s`,
    duration: `${4 + (i % 3)}s`,
    size: 3 + (i % 3) * 2,
  }));
  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-40px) scale(1.3); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} className="absolute pointer-events-none" style={{
          left: p.left, bottom: '10%',
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fcd34d, #d4af37)',
          animation: `floatUp ${p.duration} ease-in-out ${p.delay} infinite`,
          boxShadow: '0 0 6px rgba(212,175,55,0.6)',
        }} />
      ))}
    </>
  );
}

export default function HomePage() {
  return (
    <div className="starry-bg min-h-screen relative overflow-hidden" role="main" aria-label="神社マージ ホーム"
      style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(139,0,0,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)' }}>
      <FloatingParticles />
      {/* Hero */}
      <section className="text-center py-16 px-4 relative z-10" aria-label="ヒーローセクション">
        <Image src="/images/hero.png" alt="神社マージ" width={400} height={225} className="mx-auto rounded-2xl mb-4" style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.7))" }} priority />
        <h1 className="text-4xl sm:text-5xl font-black mb-3"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 40%, #B8860B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.5))',
          }}>
          神社マージ
        </h1>
        <p className="text-lg text-amber-200 mb-2 font-bold">
          神社を合体させて<br className="sm:hidden" />天照大神を目指せ！
        </p>
        <p className="text-sm mb-3" style={{ color: '#D4AF37', textShadow: '0 0 10px rgba(212,175,55,0.4)', letterSpacing: '0.15em' }}>
          鳥居からはじめ、合体を繰り返して最強の神社へ
        </p>
        <p className="text-sm mb-10 font-bold" style={{ color: '#2DD4BF', textShadow: '0 0 10px rgba(45,212,191,0.5), 0 0 20px rgba(45,212,191,0.3)', letterSpacing: '0.2em' }}>
          スコアをXでシェアして友達と競おう！
        </p>
        <Link
          href="/game"
          className="relative inline-block px-12 py-4 rounded-2xl text-xl font-black text-white min-h-[56px] transition-all duration-200 hover:-translate-y-1 active:scale-[0.95]"
          aria-label="神社マージのゲームを今すぐプレイする"
          style={{
            background: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)',
            boxShadow: '0 0 30px rgba(220,38,38,0.5), 0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2 justify-center"><ToriiSvg size={22} /> 今すぐ遊ぶ</span>
        </Link>
        <p className="mt-3 text-xs text-amber-500">
          1日3回まで無料 • プレミアムで無制限プレイ
        </p>
        {/* 連続プレイ日数ストリークバッジ */}
        <div className="mt-4 flex justify-center">
          <ShrineStreakBadge />
        </div>
        {/* ランキング・図鑑リンク */}
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/ranking"
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 min-h-[44px]"
            aria-label="週次ランキングを見る"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: "#fcd34d" }}
          >
            週次ランキング
          </Link>
          <Link
            href="/collection"
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 min-h-[44px]"
            aria-label="神様図鑑を開く"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: "#fcd34d" }}
          >
            神様図鑑
          </Link>
        </div>
      </section>

      {/* インタラクティブ合体デモ */}
      <MergeDemoSection />

      {/* 毎日変わるおみくじセクション */}
      <DailyOmikujiTeaser />

      {/* ご利益プリセット */}
      <section className="px-4 pb-8 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-4 text-base">今日の願い事を選んで参拝</h2>
        <div className="grid grid-cols-5 gap-2">
          {[
            { svg: <EnMusubiSvg />, label: "縁結び" },
            { svg: <KinunSvg />, label: "金運" },
            { svg: <GakugyoSvg />, label: "学業" },
            { svg: <KenkouSvg />, label: "健康" },
            { svg: <ShoubuSvg />, label: "勝負運" },
          ].map((item) => (
            <Link
              key={item.label}
              href="/game"
              aria-label={`${item.label}の御利益を求めてゲームをプレイする`}
              className="flex flex-col items-center gap-1 rounded-xl py-3 px-1 transition-all active:scale-95 hover:scale-105 min-h-[44px]"
              style={{
                background: "rgba(212,175,55,0.10)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(212,175,55,0.30)",
              }}
            >
              <span aria-hidden="true">{item.svg}</span>
              <span className="text-xs font-bold text-amber-300">{item.label}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-xs text-amber-600 mt-3">タップしてゲームスタート！神社を合体させて願いを叶えよう</p>
      </section>

      {/* Shrine evolution route */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-5 text-lg">神社の進化ルート</h2>
        <div className="grid grid-cols-3 gap-2">
          {SHRINES.map((s) => (
            <div
              key={s.level}
              className="rounded-xl p-3 text-center"
              style={{
                background: s.bgColor,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: s.color,
                boxShadow: s.level >= 8 ? "0 0 12px rgba(212,175,55,0.5)" : "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="text-xs font-bold mt-1">{s.name}</div>
              <div className="text-xs opacity-75">{s.goryaku}</div>
            </div>
          ))}
        </div>
      </section>

      {/* スイカゲームとの違い SEOセクション */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-5 text-lg">スイカゲームとの違い</h2>
        <div className="space-y-3 mb-4">
          {[
            {
              iconEl: <ToriiSvg size={32} />,
              title: "和の世界観・神社テーマ",
              desc: "スイカゲームはフルーツを合体させるのに対し、神社マージは鳥居・拝殿・天照大神など本物の神社格制度を再現。日本の神道文化を学びながら遊べます。",
            },
            {
              iconEl: <GoryakuSvg />,
              title: "御利益バフシステム",
              desc: "神社マージ独自の「御利益ポイント」システム。合体するほど御利益ポイントが溜まり、おみくじを引いてボーナス神社を召喚！高レベル合体で60秒間御利益2倍バフが発動。",
            },
            {
              iconEl: <OmikujiSvg />,
              title: "毎日引けるおみくじ",
              desc: "スイカゲームにはない「デイリーおみくじ」機能。大吉〜凶まで4種類のおみくじを毎日無料で引けて、大吉なら高レベル神社がボーナス出現！",
            },
          ].map((item, i) => (
            <div key={i} className="glass-card flex gap-3 items-start p-4">
              <span className="flex-shrink-0">{item.iconEl}</span>
              <div>
                <div className="font-bold text-amber-200 text-sm mb-1">{item.title}</div>
                <div className="text-xs text-amber-400 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/game"
            className="btn-shrine-red inline-block px-10 py-3 text-base font-black min-h-[44px]"
            aria-label="和風パズル神社マージを体験する">
            和風パズルを体験する
          </Link>
        </div>
      </section>

      {/* 初心者ガイド（3ステップ）*/}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-4 text-lg">初めての方へ — 3ステップで始める</h2>
        <div className="space-y-3">
          {[
            { step: "01", iconEl: <SwipeSvg />, title: "上下左右にスワイプ", desc: "画面をスワイプ（またはキーボードの矢印キー）でグリッド全体が動きます。" },
            { step: "02", iconEl: <MergeSvg />, title: "同じ神社が合体", desc: "同じ種類の神社が隣接すると自動で合体！より格の高い神社に昇格します。" },
            { step: "03", iconEl: <ToriiSvg size={22} />, title: "天照大神を目指せ", desc: "全9段階の最高位「天照大神」まで合体させるのが目標。おみくじも活用しよう！" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px" }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
                style={{ background: "rgba(212,175,55,0.25)", color: "#d4af37" }}>
                {item.step}
              </div>
              <div>
                <div className="font-bold text-amber-200 text-sm flex items-center gap-1">{item.iconEl} {item.title}</div>
                <div className="text-xs text-amber-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-amber-600 mt-3">1分でルール理解OK！まずは無料プレイを</p>
      </section>

      {/* How to play */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-5 text-lg">遊び方</h2>
        <div className="space-y-3">
          {[
            { iconEl: <SwipeSvg />, title: "スワイプ or 矢印キー", desc: "上下左右に全タイルを移動" },
            { iconEl: <MergeSvg />, title: "同じ神社をマージ", desc: "隣接した同じ神社が合体して次レベルに" },
            { iconEl: <GoryakuSvg />, title: "御利益ポイントを貯める", desc: "神社が自動でポイントを生産。おみくじに使おう！" },
            { iconEl: <OmikujiSvg />, title: "おみくじを引く", desc: "御利益ポイントで新しい神社を召喚！" },
          ].map((item, i) => (
            <div key={i} className="glass-card flex gap-3 items-start p-3">
              <span className="flex-shrink-0">{item.iconEl}</span>
              <div>
                <div className="font-bold text-amber-200 text-sm">{item.title}</div>
                <div className="text-xs text-amber-400 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SNS Share Section */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: "16px",
          }}
        >
          <p className="text-amber-300 font-black text-base mb-2">
            スコアをXでシェアしよう
          </p>
          <p className="text-amber-500 text-xs mb-4 leading-relaxed">
            ゲームオーバー後にワンタップでXに投稿できます。<br />
            友達と最高スコアを競って一緒に盛り上がろう！
          </p>
          <div
            className="rounded-xl px-4 py-3 mb-4 text-left"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(212,175,55,0.15)" }}
          >
            <p className="text-amber-400 text-xs font-bold mb-1">投稿イメージ</p>
            <p className="text-amber-200 text-xs leading-relaxed">
              「神社マージ で 8,450点！️ 最高神社は稲荷神社<br />
              鳥居から天照大神まで目指すパズルゲーム<br />
              → shrine-merge.vercel.app #神社マージ」
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("【神社マージ】鳥居から天照大神まで合体させるパズルゲームにハマってる️ → https://shrine-merge.vercel.app #神社マージ #パズルゲーム")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
              style={{ background: "#000" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Xで神社マージを紹介する
            </a>
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent("【神社マージ】鳥居から天照大神まで合体させるパズルゲーム️ 和風スイカゲームにハマってる！ https://shrine-merge.vercel.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
              style={{ background: "#06C755" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEで友達に送る
            </a>
          </div>
        </div>
      </section>

      {/* Share Testimonials */}
      <section className="px-4 pb-10 max-w-sm mx-auto text-center">
        <h2 className="font-black text-amber-300 mb-3 text-lg">みんなのシェア実績</h2>
        <div className="space-y-3">
          {[
            { score: "12,580", msg: "やっと天照大神まで合体できた！" },
            { score: "8,240", msg: "御利益2倍で一気に高得点！" },
            { score: "21,360", msg: "神社マージ最高記録更新中" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-left" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "16px" }}>
              <p className="text-amber-100 text-sm">「【神社マージ】{s.score}点達成！{s.msg}」</p>
              <p className="text-amber-500 text-xs mt-1">#神社マージ #パズルゲーム</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-600 mt-3">ゲームオーバー後にワンタップでXシェア</p>
      </section>

      {/* プレイヤーの声 */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-4 text-lg">プレイヤーの声</h2>
        <div className="space-y-3">
          {[
            { stars: 5, text: "毎日参拝してます。大吉が出た時の嬉しさは格別！", user: "@shrine_lover" },
            { stars: 5, text: "漢字の御朱印集めが楽しくて気づいたら1時間経ってた", user: "@kanji_fun" },
            { stars: 4, text: "ストリーク10日達成！御利益ありそう笑", user: "@daily_player" },
          ].map((review, i) => (
            <div key={i} className="rounded-2xl p-4"
              style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarSvg key={j} filled={j < review.stars} />
                ))}
              </div>
              <p className="text-amber-100 text-sm leading-relaxed mb-1">「{review.text}」</p>
              <p className="text-amber-600 text-xs">{review.user}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16 px-4">
        <Link
          href="/game"
          className="relative inline-block px-12 py-4 text-xl font-black rounded-2xl min-h-[56px] text-white transition-all duration-200 hover:-translate-y-1 active:scale-[0.95]"
          aria-label="神社マージのゲームをスタートする"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #8B6914 100%)',
            boxShadow: '0 0 30px rgba(212,175,55,0.5), 0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          ゲームスタート
        </Link>
        <p className="mt-3 text-xs text-amber-500">
          1日3回まで無料 • プレミアムで無制限プレイ
        </p>
      </section>

      {/* 感情フック */}
      <section className="py-10 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-amber-400 mb-5">こんな経験ありませんか？</h2>
        <div className="space-y-3">
          {[
            { text: "スマホゲームに疲れて、もっとまったり遊べるゲームが欲しい..." },
            { text: "暇つぶしに気軽に遊べる和風ゲームがなかなか見つからない..." },
            { text: "日本文化に触れながら、パズルゲームを楽しみたい..." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "20px", color: "#D4AF37" }} aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /></svg></span>
              <p style={{ color: "#fef3c7", fontSize: "13px", fontWeight: "500" }}>{item.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "14px", background: "linear-gradient(135deg, #92400e, #d97706)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>神社マージがその悩みを解決！</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>神社を合体させて最高位の天照大神へ。心が落ち着くパズル体験。</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-lg font-bold text-amber-400 mb-5">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "神社マージとはどんなゲームですか？", a: "神社の御神体をマージ（合体）させて、より格の高い神社に育てるパズルゲームです。神社同士を同じエリアに置くと次のランクに昇格します。" },
            { q: "無料で遊べますか？", a: "1日3回まで無料でプレイできます。制限なく遊びたい方はプレミアムプラン（¥480/月）にアップグレードしてください。" },
            { q: "スコアは保存されますか？", a: "ハイスコアはブラウザに保存されます。別のデバイスでの引き継ぎにはプレミアムアカウントが必要です。" },
            { q: "どこまで進化できますか？", a: "全9段階の神社レベルがあります。最高位「天照大神」を目指してください！" },
          ].map((faq, i) => (
            <div key={i} style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ color: "#fcd34d", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Q. {faq.q}</p>
              <p style={{ color: "#d4a017", fontSize: "12px" }}>A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BASEアフィリエイト */}
      <section className="py-6 px-4 max-w-lg mx-auto">
        <div style={{ background: "rgba(139,0,0,0.15)", border: "1px solid rgba(139,0,0,0.4)", borderRadius: "16px", padding: "16px" }}>
          <p style={{ color: "#fca5a5", fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>神社グッズをBASEで販売しよう</p>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8ZAE9E+2QQG+62MDD"
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(139,0,0,0.2)", border: "1px solid rgba(180,0,0,0.4)", borderRadius: "12px", padding: "12px 14px", textDecoration: "none" }}
          >
            <div>
              <div style={{ color: "#fef2f2", fontWeight: "700", fontSize: "13px" }}>BASE（ベイス）で無料ネットショップ開業</div>
              <div style={{ color: "rgba(252,165,165,0.65)", fontSize: "11px", marginTop: "2px" }}>初期費用・月額0円 • 最短5分で開設 • 35万店以上が利用</div>
            </div>
            <span style={{ color: "#fca5a5", fontWeight: "700", fontSize: "11px", background: "rgba(139,0,0,0.3)", border: "1px solid rgba(180,0,0,0.4)", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap", marginLeft: "8px" }}>無料で始める →</span>
          </a>
          <p style={{ color: "rgba(180,100,100,0.6)", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>※ 広告・PR掲載</p>
        </div>
      </section>

      {/* A8.netアフィリエイト：ハンドメイド */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <div className="rounded-2xl p-4" style={{ background: "rgba(180,120,60,0.08)", border: "1px solid rgba(180,120,60,0.25)" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#c8956a" }}>手作りお守り・縁起物を作ってみよう（PR）</p>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8PRGKY+4V0U+BXB8Z"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between rounded-xl px-4 py-3 transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(180,120,60,0.3)" }}
          >
            <div>
              <div className="text-sm font-bold" style={{ color: "#fff" }}>ハンドメイドチャンネル — 手作り作家への道</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(200,149,106,0.7)" }}>オンラインで学べる手芸・クラフト教室 • 無料体験あり</div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0 ml-2" style={{ background: "rgba(180,120,60,0.3)", color: "#c8956a" }}>無料体験 →</span>
          </a>
          <p className="text-xs text-center mt-2" style={{ color: "rgba(180,120,60,0.35)" }}>※ 広告・PR（外部サービスサイトに遷移します）</p>
        </div>
      </section>

      {/* 神社マージで楽しむ3選 */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-amber-400 mb-4">もっと楽しむ3選</h2>
        <ol className="space-y-3">
          {[
            { iconEl: <ToriiSvg size={24} />, title: "天照大神を目指して挑戦", desc: "全9段階の最高位「天照大神」まで合体できるか挑戦！日本の神社格制度を学びながら楽しめます。" },
            { iconEl: <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true"><circle cx="8" cy="12" r="5" fill="none" stroke="#FBBF24" strokeWidth="2" /><circle cx="16" cy="12" r="5" fill="none" stroke="#FBBF24" strokeWidth="2" /></svg>, title: "友達とスコアを競う", desc: "ゲームオーバー後にXでスコアをシェアして、誰が一番高い神社まで到達できるか競争しよう。" },
            { iconEl: <OmikujiSvg />, title: "毎日の癒しパズルとして", desc: "和の雰囲気で心が落ち着くパズル体験。朝の5分間の瞑想代わりに。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ lineHeight: "1" }}>{item.iconEl}</span>
              <div>
                <div style={{ color: "#fcd34d", fontWeight: "700", fontSize: "13px" }}>{i + 1}. {item.title}</div>
                <div style={{ color: "rgba(212,175,55,0.7)", fontSize: "12px", marginTop: "2px" }}>{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs text-amber-700 space-y-1"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
        <p>© 2026 ポッコリラボ</p>
        <div className="flex justify-center gap-4">
          <Link href="/legal" className="hover:text-amber-400 transition-colors">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-amber-400 transition-colors">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-amber-400 transition-colors">利用規約</Link>
        </div>
      </footer>
    </div>
  );
}
