import type { Metadata } from "next";
import "./globals.css";
import "the-new-css-reset/css/reset.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "スマブラ世界戦闘力ランキング",
  description: "大乱闘スマッシュブラザーズspの世界戦闘力のランキングサイトです。X(旧Twitter)でログインしてスクリーンショットを投稿することで、ランクに参加することができます。",
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
          async
          strategy="lazyOnload"
          src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3254973128088123"}
          crossOrigin="anonymous"
        />
      </head>
      <AppProvider>
        <body>
          <Header/>
            {children}
          <Footer/>
        </body> 
      </AppProvider>
    </html>
  );
}
