import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanabi Web",
  description: "Play Hanabi in your browser"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-night-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}

