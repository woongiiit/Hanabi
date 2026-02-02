"use client";

import Link from "next/link";
import { NightSky } from "@/components/NightSky";
import { useProfileStore } from "@/store/profileStore";
import { getSupabaseClient } from "@/lib/realtime/supabase";

export function LobbyClient() {
  const { nickname, preferredMode } = useProfileStore();
  const hasSupabase = Boolean(getSupabaseClient());
  const mode = preferredMode === "auto" ? (hasSupabase ? "online" : "local") : preferredMode;

  return (
    <main className="relative min-h-dvh">
      <NightSky />
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10">
        <header className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-slate-300/80">Lobby</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">안녕하세요, {nickname || "플레이어"}님</h1>
          <p className="mt-2 text-slate-200/80">
            입장 후 <span className="font-semibold">방 만들기</span> 또는 <span className="font-semibold">방 들어가기</span>를 선택하세요.
          </p>
          <div className="mt-2 text-xs text-slate-200/60">모드: {mode}</div>
        </header>

        {!nickname ? (
          <div className="glass mt-6 rounded-2xl p-6 text-sm text-slate-200/80">
            닉네임이 설정되지 않았습니다. <Link className="underline" href="/">처음 화면</Link>에서 닉네임을 입력해주세요.
          </div>
        ) : (
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link className="btn-primary w-full" href={`/lobby/create?mode=${mode}`}>
              방 만들기
            </Link>
            <Link className="btn-ghost w-full" href={`/lobby/join?mode=${mode}`}>
              방 들어가기
            </Link>
          </section>
        )}

        <footer className="mt-auto pt-10 text-center text-xs text-slate-300/70">
          Next.js + Tailwind + Framer Motion + Zustand
        </footer>
      </div>
    </main>
  );
}

