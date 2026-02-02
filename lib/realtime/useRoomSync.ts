"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "./supabase";
import type { GameAction, GameState, PlayerId } from "@/lib/hanabi/types";
import { useGameStore } from "@/store/gameStore";

type BroadcastMessage =
  | { kind: "REQ_STATE"; from: PlayerId; t: number }
  | { kind: "STATE"; from: PlayerId; t: number; state: GameState }
  | { kind: "ACTION"; from: PlayerId; t: number; action: GameAction };

export function useRoomSync(roomId: string, enabledByMode: boolean) {
  const supabase = getSupabaseClient();
  const { viewerId, state, replaceState, attachSync, dispatch } = useGameStore();
  const [status, setStatus] = useState<"disabled" | "connecting" | "connected" | "error">("disabled");

  const roomKey = `hanabi:${roomId}`;
  const lastStateVersionRef = useRef<number>(state?.version ?? -1);
  const stateRef = useRef<GameState | null>(state);
  const appliedActionIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    lastStateVersionRef.current = state?.version ?? -1;
  }, [state?.version]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!enabledByMode || !supabase) {
      setStatus("disabled");
      attachSync(null);
      return;
    }

    let cancelled = false;
    setStatus("connecting");

    const channel = supabase.channel(roomKey, {
      config: { broadcast: { self: false }, presence: { key: viewerId } }
    });

    const onMessage = (m: BroadcastMessage) => {
      if (cancelled) return;
      if (!m || (m as any).kind === undefined) return;

      if (m.kind === "REQ_STATE") {
        const snapshot = stateRef.current;
        if (!snapshot) return;
        channel.send({
          type: "broadcast",
          event: "msg",
          payload: { kind: "STATE", from: viewerId, t: Date.now(), state: snapshot } satisfies BroadcastMessage
        });
        return;
      }

      if (m.kind === "STATE") {
        const incoming = m.state;
        const localV = lastStateVersionRef.current;
        if (!incoming) return;
        if (!stateRef.current || incoming.version > localV) {
          replaceState(incoming);
        }
        return;
      }

      if (m.kind === "ACTION") {
        const a = m.action;
        if (!a) return;
        if (appliedActionIdsRef.current.has(a.id)) return;
        appliedActionIdsRef.current.add(a.id);
        dispatch({ ...(a as any), __remote: true });
      }
    };

    channel.on("broadcast", { event: "msg" }, ({ payload }) => onMessage(payload as BroadcastMessage));

    channel.subscribe((st) => {
      if (cancelled) return;
      if (st === "SUBSCRIBED") {
        setStatus("connected");
        channel.send({ type: "broadcast", event: "msg", payload: { kind: "REQ_STATE", from: viewerId, t: Date.now() } satisfies BroadcastMessage });
      } else if (st === "CHANNEL_ERROR" || st === "TIMED_OUT") {
        setStatus("error");
      }
    });

    attachSync((action: GameAction) => {
      channel.send({ type: "broadcast", event: "msg", payload: { kind: "ACTION", from: viewerId, t: Date.now(), action } satisfies BroadcastMessage });
    });

    return () => {
      cancelled = true;
      attachSync(null);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledByMode, supabase, roomKey, viewerId]);

  return { status, enabled: Boolean(enabledByMode && supabase) };
}

