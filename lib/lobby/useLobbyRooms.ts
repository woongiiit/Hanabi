"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/realtime/supabase";
import type { RoomSummary } from "@/lib/lobby/types";
import { readLocalRooms } from "@/lib/lobby/localRooms";
import { randomKey } from "@/lib/lobby/ids";

type PresenceRoomPayload = {
  kind: "room";
  id: string;
  title: string;
  playerCount: number;
  createdAt: number;
};

function fromPresenceState(state: Record<string, any[]>): RoomSummary[] {
  const rooms: RoomSummary[] = [];
  for (const key of Object.keys(state)) {
    const arr = state[key] ?? [];
    for (const item of arr) {
      const p = item as PresenceRoomPayload;
      if (p?.kind === "room" && p.id && p.title && p.playerCount) {
        rooms.push({ id: p.id, title: p.title, playerCount: p.playerCount, createdAt: p.createdAt ?? Date.now(), mode: "online" });
      }
    }
  }
  const uniq = new Map<string, RoomSummary>();
  for (const r of rooms) {
    const prev = uniq.get(r.id);
    if (!prev || r.createdAt > prev.createdAt) uniq.set(r.id, r);
  }
  return Array.from(uniq.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function useLobbyRooms(mode: "online" | "local") {
  const supabase = getSupabaseClient();
  const [roomsOnline, setRoomsOnline] = useState<RoomSummary[]>([]);
  const [roomsLocal, setRoomsLocal] = useState<RoomSummary[]>([]);
  const [status, setStatus] = useState<"disabled" | "connecting" | "connected" | "error">("disabled");

  useEffect(() => {
    if (mode !== "local") return;
    setRoomsLocal(readLocalRooms());
    const onStorage = () => setRoomsLocal(readLocalRooms());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [mode]);

  useEffect(() => {
    if (mode !== "online" || !supabase) {
      setStatus("disabled");
      setRoomsOnline([]);
      return;
    }

    let cancelled = false;
    setStatus("connecting");

    const channel = supabase.channel("hanabi:lobby", {
      config: { presence: { key: randomKey("viewer") }, broadcast: { self: false } }
    });

    const sync = () => {
      if (cancelled) return;
      const st = channel.presenceState();
      setRoomsOnline(fromPresenceState(st as any));
    };

    channel.on("presence", { event: "sync" }, sync);
    channel.on("presence", { event: "join" }, sync);
    channel.on("presence", { event: "leave" }, sync);

    channel.subscribe((st) => {
      if (cancelled) return;
      if (st === "SUBSCRIBED") {
        setStatus("connected");
      } else if (st === "CHANNEL_ERROR" || st === "TIMED_OUT") {
        setStatus("error");
      }
    });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [mode, supabase]);

  const rooms = useMemo(() => (mode === "online" ? roomsOnline : roomsLocal), [mode, roomsOnline, roomsLocal]);

  return { rooms, status, enabled: mode === "online" ? Boolean(supabase) : true };
}

