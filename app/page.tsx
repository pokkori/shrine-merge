import Link from "next/link";
import { SHRINES } from "@/lib/game";

export default function HomePage() {
  return (
    <div className="starry-bg min-h-screen">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <div className="text-7xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.6))" }}>⛩️</div>
        <h1 className="text-4xl sm:text-5xl font-black mb-3"
          style={{ color: "#d4af37", textShadow: "0 0 24px rgba(212,175,55,0.4)" }}>
          神社マージ
        </h1>
        <p className="text-lg text-amber-200 mb-2 font-bold">
          神社を合体させて<br className="sm:hidden" />天照大神を目指せ！
        </p>
        <p className="text-sm text-amber-500 mb-10">
          鳥居からはじめ、合体を繰り返して最強の神社へ
        </p>
        <Link
          href="/game"
          className="btn-shrine-red inline-block px-12 py-4 text-xl font-black"
        >
          今すぐ遊ぶ 🎋
        </Link>
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

      {/* How to play */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <h2 className="text-center font-black text-amber-300 mb-5 text-lg">遊び方</h2>
        <div className="space-y-3">
          {[
            { icon: "👆", title: "スワイプ or 矢印キー", desc: "上下左右に全タイルを移動" },
            { icon: "✨", title: "同じ神社をマージ", desc: "隣接した同じ神社が合体して次レベルに" },
            { icon: "🌟", title: "御利益ポイントを貯める", desc: "神社が自動でポイントを生産。おみくじに使おう！" },
            { icon: "🎋", title: "おみくじを引く", desc: "御利益ポイントで新しい神社を召喚！" },
          ].map((item, i) => (
            <div key={i} className="glass-card flex gap-3 items-start p-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-bold text-amber-200 text-sm">{item.title}</div>
                <div className="text-xs text-amber-400 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-16 px-4">
        <Link
          href="/game"
          className="btn-gold inline-block px-12 py-4 text-xl font-black rounded-2xl"
        >
          ゲームスタート ⛩️
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs text-amber-700 space-y-1"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
        <p>© 2026 ポッコリラボ</p>
        <div className="flex justify-center gap-4">
          <Link href="/legal" className="hover:text-amber-400 transition-colors">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-amber-400 transition-colors">プライバシーポリシー</Link>
        </div>
      </footer>
    </div>
  );
}
