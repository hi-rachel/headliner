import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Headliner - 주요 뉴스 한눈에 보기",
  description:
    "매일 업데이트되는 국내 주요 뉴스와 기술 뉴스를 한눈에 확인하세요.",
  keywords: [
    "뉴스",
    "헤드라인",
    "기술 뉴스",
    "Hacker News",
    "뉴스 모음",
    "headlines",
  ],
  authors: [{ name: "Headliner" }],
  openGraph: {
    title: "Headliner - 주요 뉴스 한눈에 보기",
    description:
      "매일 업데이트되는 국내 주요 뉴스와 기술 뉴스를 한눈에 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "Headliner",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Headliner - 주요 뉴스 한눈에 보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Headliner - 주요 뉴스 한눈에 보기",
    description:
      "매일 업데이트되는 국내 주요 뉴스와 기술 뉴스를 한눈에 확인하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Headliner - 주요 뉴스 한눈에 보기",
      },
    ],
    creator: "@headliner",
    site: "@headliner",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  category: "news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
