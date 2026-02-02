"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NightSky } from "@/components/NightSky";
import { useGameStore } from "@/store/gameStore";
import type { PlayerId } from "@/lib/hanabi/types";
import { GameBoard } from "@/components/game/GameBoard";
import { useRoomSync } from "@/lib/realtime/useRoomSync";

function asPlayerId(v: string | null): PlayerId {
  if (!v) return "P1";
  const up = v.toUpperCase();
  if (/^P[1-5]$/.test(up)) return up as PlayerId;
  return "P1";
}

export function RoomClient({ roomId }: { roomId: string }) {
  const sp = useSearchParams();
  const modeParam = sp.get("mode");
  const meParam = sp.get("me");
  const mode = modeParam === "online" ? "online" : "local";
  const me = asPlayerId(meParam);

  const { initRoom, setViewerId, viewerId, state, reset } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    initRoom(roomId, mode, 2);
    setViewerId(me);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, modeParam, meParam]);

  const playerOptions = useMemo(() => (state?.players ?? []).map((p) => p.id), [state?.players]);

  const sync = useRoomSync(roomId, mode === "online");

  if (!mounted) return null;

  return (
    <main className="relative min-h-dvh">
      <NightSky />
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-slate-300/80">Room</div>
            <div className="truncate text-lg font-semibold">{roomId}</div>
            <div className="mt-1 text-xs text-slate-200/70">
              공유 URL: <code className="rounded bg-white/10 px-1">/room/{roomId}?me=P2</code>
            </div>
            <div className="mt-1 text-[10px] text-slate-200/60">
              모드: {mode} / Sync: {sync.enabled ? sync.status : "disabled"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-slate-200/70">내 시점</label>
            <select
              className="glass rounded-xl px-3 py-2 text-sm"
              value={viewerId}
              onChange={(e) => setViewerId(asPlayerId(e.target.value))}
            >
              {(playerOptions.length ? playerOptions : ["P1", "P2"]).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button className="btn-ghost" onClick={() => reset()}>
              리셋
            </button>
          </div>
        </div>

        <div className="mt-4">
          <GameBoard />
        </div>
      </div>
    </main>
  );
}

