"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NightSky } from "@/components/NightSky";
import { useProfileStore } from "@/store/profileStore";
import { randomRoomId } from "@/lib/lobby/ids";
import type { RoomSummary } from "@/lib/lobby/types";
import { upsertLocalRoom } from "@/lib/lobby/localRooms";
import { getSupabaseClient } from "@/lib/realtime/supabase";

export function CreateRoomClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const mode = (sp.get("mode") === "local" ? "local" : "online") as "online" | "local";

  const { nickname } = useProfileStore();
  const hasSupabase = useMemo(() => Boolean(getSupabaseClient()), []);
  const effectiveMode = mode === "online" && hasSupabase ? "online" : "local";

  const [title, setTitle] = useState("새 방");
  const [playerCount, setPlayerCount] = useState(2);

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
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-slate-300/80">Create Room</div>
          <h1 className="mt-2 text-2xl font-semibold">방 만들기</h1>
          <p className="mt-2 text-sm text-slate-200/70">방 제목, 플레이 인원 수 등을 입력하고 만들기를 누르세요.</p>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-slate-200/80">방 제목</span>
              <input
                className="glass rounded-xl px-4 py-3 outline-none focus:border-white/30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-slate-200/80">플레이 인원</span>
              <select
                className="glass rounded-xl px-4 py-3"
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
              >
                {[2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-200/60">하나비는 2~5명이 적절합니다.</div>
            </label>

            <div className="flex gap-2">
              <button
                className="btn-primary w-full"
                onClick={() => {
                  const id = randomRoomId();
                  const room: RoomSummary = {
                    id,
                    title: title.trim() || "새 방",
                    playerCount,
                    createdAt: Date.now(),
                    mode: effectiveMode
                  };
                  if (effectiveMode === "local") upsertLocalRoom(room);
                  router.push(`/room/${id}?mode=${effectiveMode}&me=P1&pc=${playerCount}&title=${encodeURIComponent(room.title)}`);
                }}
              >
                만들기
              </button>
              <Link className="btn-ghost w-full" href="/lobby">
                취소
              </Link>
            </div>

            {mode === "online" && !hasSupabase ? (
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs text-amber-100/90">
                Supabase 환경변수가 설정되지 않아 온라인 모드를 사용할 수 없습니다. 로컬 모드로 방이 생성됩니다.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

