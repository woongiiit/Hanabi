"use client";

import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/realtime/supabase";
import type { RoomSummary } from "@/lib/lobby/types";

export function useAdvertiseRoom(room: RoomSummary | null, enabled: boolean) {
  const supabase = getSupabaseClient();

  useEffect(() => {
    const roomId = room?.id;
    const title = room?.title;
    const playerCount = room?.playerCount;
    const createdAt = room?.createdAt;
    if (!enabled || !supabase || !roomId || !title || !playerCount || !createdAt) return;

    let cancelled = false;
    const channel = supabase.channel("hanabi:lobby", {
      config: { presence: { key: roomId }, broadcast: { self: false } }
    });

    channel.subscribe(async (st) => {
      if (cancelled) return;
      if (st === "SUBSCRIBED") {
        await channel.track({
          kind: "room",
          id: roomId,
          title,
          playerCount,
          createdAt
        });
      }
    });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [enabled, supabase, room?.id, room?.title, room?.playerCount, room?.createdAt]);
}

