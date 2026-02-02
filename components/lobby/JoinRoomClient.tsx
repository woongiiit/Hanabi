"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { NightSky } from "@/components/NightSky";
import { useProfileStore } from "@/store/profileStore";
import { useLobbyRooms } from "@/lib/lobby/useLobbyRooms";
import { getSupabaseClient } from "@/lib/realtime/supabase";

export function JoinRoomClient() {
  const sp = useSearchParams();
  const modeParam = sp.get("mode");
  const requestedMode = modeParam === "local" ? "local" : "online";

  const { nickname, preferredMode } = useProfileStore();
  const hasSupabase = useMemo(() => Boolean(getSupabaseClient()), []);
  const mode = preferredMode === "auto" ? (hasSupabase ? "online" : "local") : preferredMode;
  const effectiveMode = requestedMode === "online" && mode === "online" && hasSupabase ? "online" : "local";

  const { rooms, status, enabled } = useLobbyRooms(effectiveMode);

  if (!nickname) {
    return (
      <main className="relative min-h-dvh">
        <NightSky />
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="glass rounded-2xl p-6 text-slate-200/80">
            닉네임이 필요합니다. <Link className="underline" href="/">처음 화면</Link>에서 닉네임을 입력해주세요.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh">
      <NightSky />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-300/80">Join Room</div>
              <h1 className="mt-2 text-2xl font-semibold">방 들어가기</h1>
              <p className="mt-2 text-sm text-slate-200/70">현재 존재하는 방 목록에서 하나를 선택해 입장하세요.</p>
              <div className="mt-2 text-xs text-slate-200/60">
                모드: {effectiveMode} / 목록: {effectiveMode === "online" ? (enabled ? status : "disabled") : "local"}
              </div>
            </div>
            <Link className="btn-ghost px-3 py-2 text-sm" href="/lobby">
              뒤로
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/80">
                표시할 방이 없습니다. <Link className="underline" href={`/lobby/create?mode=${effectiveMode}`}>방을 만들어</Link> 보세요.
                {effectiveMode === "online" ? (
                  <div className="mt-2 text-xs text-slate-200/60">
                    (온라인 목록은 “현재 접속 중인 방(호스트가 광고 중)”만 보입니다.)
                  </div>
                ) : null}
              </div>
            ) : (
              rooms.map((r) => (
                <Link
                  key={r.id}
                  className="glass flex items-center justify-between rounded-2xl p-4 hover:bg-white/10"
                  href={`/room/${r.id}?mode=${effectiveMode}&me=P2&pc=${r.playerCount}&title=${encodeURIComponent(r.title)}`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{r.title}</div>
                    <div className="mt-1 text-xs text-slate-200/70">
                      ID: {r.id} · 인원: {r.playerCount}명
                    </div>
                  </div>
                  <div className="text-xs text-slate-200/70">입장</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

