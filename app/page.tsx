import Link from "next/link";
import Image from "next/image";
import { SHRINES } from "@/lib/game";

export default function HomePage() {
  return (
    <div className="starry-bg min-h-screen">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <Image src="/images/hero.png" alt="神社マージ" width={400} height={225} className="mx-auto rounded-2xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.6))" }} priority />
        <h1 className="text-4xl sm:text-5xl font-black mb-3"
          style={{ color: "#d4af37", textShadow: "0 0 24px rgba(212,175,55,0.4)" }}>
          神社マージ
        </h1>
        <p className="text-lg text-amber-200 mb-2 font-bold">
          神社を合体させて<br className="sm:hidden" />天照大神を目指せ！
        </p>
        <p className="text-sm text-amber-500 mb-3">
          鳥居からはじめ、合体を繰り返して最強の神社へ
        </p>
        <p className="text-sm text-amber-300 mb-10 font-bold">
          🦊 スコアをXでシェアして友達と競おう！
        </p>
        <Link
          href="/game"
          className="btn-shrine-red inline-block px-12 py-4 text-xl font-black"
        >
          今すぐ遊ぶ
        </Link>
        <p className="mt-3 text-xs text-amber-500">
          1日3回まで無料 • プレミアムで無制限プレイ
        </p>
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

      {/* SNS Share Section */}
      <section className="px-4 pb-10 max-w-sm mx-auto">
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <p className="text-amber-300 font-black text-base mb-2">
            🦊 スコアをXでシェアしよう
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
              「神社マージ で 8,450点！⛩️ 最高神社は稲荷神社🦊<br />
              鳥居から天照大神まで目指すパズルゲーム<br />
              → shrine-merge.vercel.app #神社マージ」
            </p>
          </div>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("【神社マージ】鳥居から天照大神まで合体させるパズルゲームにハマってる⛩️🦊 → https://shrine-merge.vercel.app #神社マージ #パズルゲーム")}`}
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
        </div>
      </section>

      {/* Share Testimonials */}
      <section className="px-4 pb-10 max-w-sm mx-auto text-center">
        <h2 className="font-black text-amber-300 mb-3 text-lg">みんなのシェア実績</h2>
        <div className="space-y-3">
          {[
            { score: "12,580", msg: "やっと天照大神まで合体できた！" },
            { score: "8,240", msg: "御利益2倍で一気に高得点！" },
            { score: "21,360", msg: "神社マージ最高記録更新中🦊" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-left" style={{background: "rgba(255,255,255,0.05)", border: "1px solid rgba(251,191,36,0.2)"}}>
              <p className="text-amber-100 text-sm">「【神社マージ】{s.score}点達成！{s.msg}」</p>
              <p className="text-amber-500 text-xs mt-1">#神社マージ #パズルゲーム</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-600 mt-3">ゲームオーバー後にワンタップでXシェア</p>
      </section>

      {/* CTA */}
      <section className="text-center pb-16 px-4">
        <Link
          href="/game"
          className="btn-gold inline-block px-12 py-4 text-xl font-black rounded-2xl"
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
            { icon: "😓", text: "スマホゲームに疲れて、もっとまったり遊べるゲームが欲しい..." },
            { icon: "😤", text: "暇つぶしに気軽に遊べる和風ゲームがなかなか見つからない..." },
            { icon: "💭", text: "日本文化に触れながら、パズルゲームを楽しみたい..." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <p style={{ color: "#fef3c7", fontSize: "13px", fontWeight: "500" }}>{item.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "14px", background: "linear-gradient(135deg, #92400e, #d97706)", borderRadius: "14px", padding: "14px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>神社マージがその悩みを解決！</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>神社を合体させて最高位の大神宮へ。心が落ち着くパズル体験。</p>
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
            { q: "どこまで進化できますか？", a: "全12段階の神社レベルがあります。最高位の神社「大神宮」を目指してください！" },
          ].map((faq, i) => (
            <div key={i} style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px", padding: "14px 16px" }}>
              <p style={{ color: "#fcd34d", fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>Q. {faq.q}</p>
              <p style={{ color: "#d4a017", fontSize: "12px" }}>A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 神社マージで楽しむ3選 */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-amber-400 mb-4">⛩️ もっと楽しむ3選</h2>
        <ol className="space-y-3">
          {[
            { icon: "🏆", title: "大神宮を目指して挑戦", desc: "全12段階の最高位「大神宮」まで合体できるか挑戦！日本の神社格制度を学びながら楽しめます。" },
            { icon: "🦊", title: "友達とスコアを競う", desc: "ゲームオーバー後にXでスコアをシェアして、誰が一番高い神社まで到達できるか競争しよう。" },
            { icon: "🌸", title: "毎日の癒しパズルとして", desc: "和の雰囲気で心が落ち着くパズル体験。朝の5分間の瞑想代わりに。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px", padding: "12px 14px" }}>
              <span style={{ fontSize: "24px", lineHeight: "1" }}>{item.icon}</span>
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
