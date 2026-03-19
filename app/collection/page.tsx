import type { Metadata } from "next";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  title: "神社マージ コレクション図鑑 - 全9神社の合体ルールとご利益一覧",
  description:
    "神社マージに登場する全9種の神社（鳥居・狛犬・手水舎・拝殿・本殿・神宮・大社・総本社・天照大神）の合体ルール・ご利益を解説。ゲームでコレクションを完成させよう！",
  openGraph: {
    title: "神社マージ コレクション図鑑 - 全9神社のご利益一覧",
    description:
      "鳥居から天照大神まで全9種類の神社を解説。ゲームで合成して図鑑をコンプリートしよう！",
    url: "https://shrine-merge.vercel.app/collection",
    type: "website",
    locale: "ja_JP",
  },
  alternates: {
    canonical: "https://shrine-merge.vercel.app/collection",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "神社マージ",
      operatingSystem: "Web",
      applicationCategory: "GameApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
      url: "https://shrine-merge.vercel.app",
      description:
        "神社を合体させて天照大神を目指すパズルゲーム。鳥居から始まり全9種類の神社を合成してスコアを競う。",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "神社マージの神社は全部で何種類ありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "全9種類です。鳥居（Lv.1）・狛犬（Lv.2）・手水舎（Lv.3）・拝殿（Lv.4）・本殿（Lv.5）・神宮（Lv.6）・大社（Lv.7）・総本社（Lv.8）・天照大神（Lv.9）が登場します。",
          },
        },
        {
          "@type": "Question",
          name: "天照大神まで合成するにはどうすればいいですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "同じレベルの神社タイルを隣接させてスワイプすると合成できます。鳥居×2→狛犬→…と順番に合成を繰り返し、最終的に総本社×2を合成すると天照大神が完成します。",
          },
        },
        {
          "@type": "Question",
          name: "各神社のご利益は何ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "鳥居=縁結び、狛犬=魔除け、手水舎=浄化、拝殿=開運、本殿=健康、神宮=金運、大社=出世、総本社=万能、天照大神=最強のご利益があります。",
          },
        },
        {
          "@type": "Question",
          name: "コレクション図鑑はどうやって埋めますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ゲームで神社を合成するたびに、その神社が自動的に図鑑に解放されます。全9体を合成するとコレクション完成です。",
          },
        },
      ],
    },
  ],
};

export default function CollectionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionClient />
    </>
  );
}
