import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import "../styles/globals.css";
import { noto_sans_jp } from "./ui/fonts";

export const metadata: Metadata = {
  title: "SmashRank",
  description:
    "大乱闘スマッシュブラザーズspの世界戦闘力のランキングサイトです。X(旧Twitter)でログインしてスクリーンショットを投稿することで、ランクに参加することができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          id="Absence-banner"
          strategy="afterInteractive"
          src={
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3254973128088123"
          }
          crossOrigin="anonymous"
        />
      </head>
      <AppProvider>
        <body
          className={`${noto_sans_jp.className} min-h-screen flex flex-col antialiased`}
        >
          <Header />
          <div className="flex-grow">{children}</div>
          <Footer />
        </body>
      </AppProvider>
    </html>
  );
}
