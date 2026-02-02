"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NightSky } from "@/components/NightSky";
import { useProfileStore } from "@/store/profileStore";
import { getSupabaseClient } from "@/lib/realtime/supabase";

export function HomeClient() {
  const router = useRouter();
  const { nickname, setNickname, preferredMode, setPreferredMode } = useProfileStore();
  const [name, setName] = useState(nickname);

  const hasSupabase = useMemo(() => Boolean(getSupabaseClient()), []);

  const effectiveMode =
    preferredMode === "auto" ? (hasSupabase ? "online" : "local") : (preferredMode as "online" | "local");

  return (
    <main className="relative min-h-dvh">
      <NightSky />
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 py-10">
        <header className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-slate-300/80">Hanabi Web</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">온라인 하나비 (웹)</h1>
          <p className="mt-3 text-slate-200/80">닉네임을 입력하고 로비로 입장하세요.</p>
        </header>

        <section className="glass mt-6 rounded-2xl p-6">
          <label className="grid gap-2">
            <span className="text-sm text-slate-200/80">닉네임</span>
            <input
              className="glass rounded-xl px-4 py-3 text-base outline-none focus:border-white/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: meta"
              maxLength={16}
            />
          </label>

          <div className="mt-4">
            <div className="text-sm text-slate-200/80">플레이 모드</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <button
                className={preferredMode === "auto" ? "btn-primary" : "btn-ghost"}
                onClick={() => setPreferredMode("auto")}
                type="button"
              >
                자동
              </button>
              <button
                className={preferredMode === "online" ? "btn-primary" : "btn-ghost"}
                onClick={() => setPreferredMode("online")}
                type="button"
                disabled={!hasSupabase}
                title={!hasSupabase ? "Supabase 환경변수가 필요합니다" : undefined}
              >
                온라인
              </button>
              <button
                className={preferredMode === "local" ? "btn-primary" : "btn-ghost"}
                onClick={() => setPreferredMode("local")}
                type="button"
              >
                로컬
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-200/60">
              현재 선택: <span className="font-semibold">{effectiveMode}</span>
              {hasSupabase ? "" : " (Supabase 미설정 → 온라인 비활성)"}
            </div>
          </div>

          <button
            className="btn-primary mt-6 w-full"
            onClick={() => {
              const trimmed = name.trim();
              if (!trimmed) return;
              setNickname(trimmed);
              router.push("/lobby");
            }}
          >
            입장
          </button>
        </section>

        <footer className="mt-auto pt-10 text-center text-xs text-slate-300/70">
          Next.js + Tailwind + Framer Motion + Zustand
        </footer>
      </div>
    </main>
  );
}

