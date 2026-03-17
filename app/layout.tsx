import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "神社マージ - 神社を合体させて最強の神社を目指せ！",
  description: "鳥居から天照大神まで、神社を合体させてスコアを競うパズルゲーム。無料プレイ！",
  metadataBase: new URL("https://shrine-merge.vercel.app"),
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛩️</text></svg>" },
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
