import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanabi Web",
  description: "Play Hanabi in your browser"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    <html lang="ko">
      <body className="min-h-dvh bg-night-950 text-slate-100 antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `globalThis.__HANABI_SUPABASE__=${JSON.stringify({ url, anon })};`
          }}
        />
        {children}
      </body>
    </html>
  );
}

