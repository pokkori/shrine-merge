import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://shrine-merge.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "神社マージ",
      "url": SITE_URL,
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
        "description": "1日3回まで無料",
      },
      "description": "神社を合体させて最強の神社を目指す和風マージパズルゲーム。鳥居から天照大神まで全9段階。",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "神社マージとはどんなゲームですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "神社の御神体をマージ（合体）させて、より格の高い神社に育てるパズルゲームです。鳥居からはじめ、合体を繰り返して最高位「天照大神」を目指します。スイカゲーム式の物理パズルで、日本の神社格制度を学びながら遊べます。",
          },
        },
        {
          "@type": "Question",
          "name": "無料で遊べますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、1日3回まで無料でプレイできます。制限なく遊びたい方はプレミアムプラン（¥480/月）にアップグレードしてください。",
          },
        },
        {
          "@type": "Question",
          "name": "おみくじとは何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "毎日無料で引けるゲーム内おみくじです。大吉〜凶の4種類があり、大吉が出ると高レベルの神社がボーナス出現します。御利益ポイントを使っておみくじを引くこともできます。",
          },
        },
        {
          "@type": "Question",
          "name": "最高位の神社は何ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "全9段階の最高位は「天照大神」です。鳥居→小祠→社→拝殿→境内社→村社→郷社→大社→天照大神の順に進化します。",
          },
        },
        {
          "@type": "Question",
          "name": "スコアはどうやって保存しますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ハイスコアはブラウザのローカルストレージに自動保存されます。別のデバイスでの引き継ぎにはプレミアムアカウントが必要です。",
          },
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: "神社マージ - 神社を合体させて最強の神社を目指せ！",
  description: "鳥居から天照大神まで、神社を合体させてスコアを競うパズルゲーム。無料プレイ！",
  metadataBase: new URL("https://shrine-merge.vercel.app"),
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>️</text></svg>" },
  openGraph: {
    title: "神社マージ - 神社を合体させて最強の神社を目指せ！",
    description: "神社を合体させる新感覚パズルゲーム。鳥居から天照大神まで合体させてスコアを競おう！",
    url: "https://shrine-merge.vercel.app",
    siteName: "神社マージ",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/images/hero.png", width: 400, height: 225, alt: "神社マージ ゲーム画面" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "神社マージ - 神社を合体させて最強の神社を目指せ！",
    description: "神社を合体させる新感覚パズルゲーム。鳥居から天照大神まで合体させてスコアを競おう！",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
