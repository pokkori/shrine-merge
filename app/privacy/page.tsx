import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#fef9f0" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-8">プライバシーポリシー</h1>
        <div className="space-y-6 text-sm text-amber-900">
          <section>
            <h2 className="font-bold text-base mb-2">個人情報の取扱い</h2>
            <p>神社マージは個人情報（氏名、住所、メールアドレス等）を一切収集しません。</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">localStorage の利用</h2>
            <p>本ゲームはベストスコアを保存するためにブラウザの localStorage を使用します。</p>
            <p>保存される情報：スコアデータ（数値のみ）。外部サーバーに送信されることはありません。</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">クッキー</h2>
            <p>本サービスでは現在クッキーを使用していません。</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">お問い合わせ</h2>
            <p>X(Twitter) @levona_design へのDMにて受付けます。</p>
          </section>
          <p className="text-xs text-amber-600">第一版 2026年3月16日</p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-amber-700 hover:underline text-sm">← トップに戻る</Link>
        </div>
      </div>
    </div>
  );
}
