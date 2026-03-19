import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#fef9f0" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-8">特定商取引法に基づく表示</h1>
        <div className="space-y-6 text-sm text-amber-900">
          <section>
            <h2 className="font-bold text-base mb-2">販売業者</h2>
            <p>氏名：新美諭</p>
            <p>代表：新美</p>
            <p>住所：〒475-0077 愛知県半田市元山町</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">電話番号</h2>
            <p>090-6093-5290</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">問い合わせ</h2>
            <p>levonadesign@gmail.com（X: @levona_design）</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">サービス名</h2>
            <p>神社マージ（SHRINE MERGE）</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">販売価格</h2>
            <p>基本無料（一部有料スキン ¥120～¥480）</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">支払い時期・方法</h2>
            <p>有料コンテンツ購入時にお支払いいただきます。</p>
            <p>対応クレジットカードによる決済になります。</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">返金・キャンセル</h2>
            <p>デジタルコンテンツの性質上、購入完了後の返金はお断りしております。ご了承ください。</p>
          </section>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-amber-700 hover:underline text-sm">← トップに戻る</Link>
        </div>
      </div>
    </div>
  );
}
