/* eslint-disable no-console */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameAction, GameState, PlayerId } from "@/lib/hanabi/types";
import { reduce } from "@/lib/hanabi/engine";

type Mode = "local" | "online";

type WithMeta<T extends GameAction> = Omit<T, "id" | "t"> & { id?: string; t?: number; __remote?: boolean };
type DispatchInput =
  | WithMeta<Extract<GameAction, { type: "START" }>>
  | WithMeta<Extract<GameAction, { type: "SET_NAMES" }>>
  | WithMeta<Extract<GameAction, { type: "GIVE_HINT" }>>
  | WithMeta<Extract<GameAction, { type: "PLAY_CARD" }>>
  | WithMeta<Extract<GameAction, { type: "DISCARD_CARD" }>>;

type GameStore = {
  mode: Mode;
  roomId: string | null;
  viewerId: PlayerId;
  state: GameState | null;
  __syncSend?: (action: GameAction) => void;
  attachSync: (send: ((action: GameAction) => void) | null) => void;
  replaceState: (state: GameState) => void;
  setViewerId: (id: PlayerId) => void;
  initRoom: (roomId: string, mode: Mode, playerCount?: number) => void;
  dispatch: (action: DispatchInput) => void;
  reset: () => void;
};

function makeId() {
  return `${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      mode: "local",
      roomId: null,
      viewerId: "P1",
      state: null,
      __syncSend: undefined,
      attachSync: (send) => set({ __syncSend: send ?? undefined }),
      replaceState: (state) => set({ state }),
      setViewerId: (id) => set({ viewerId: id }),
      initRoom: (roomId, mode, playerCount = 2) => {
        const s = get().state;
        if (s?.roomId === roomId) {
          set({ roomId, mode });
          return;
        }
        const t = Date.now();
        const start: GameAction = {
          id: makeId(),
          t,
          type: "START",
          payload: { roomId, playerCount }
        };
        set({ roomId, mode, state: reduce(null, start) });
      },
      dispatch: (partial) => {
        const prev = get().state;
        if (!prev && partial.type !== "START") return;
        const action: GameAction = { ...(partial as any), id: partial.id ?? makeId(), t: partial.t ?? Date.now() } as GameAction;
        const isRemote = Boolean((partial as DispatchInput).__remote);
        const next = reduce(prev, action);
        set({ state: next });
        const send = get().__syncSend;
        if (!isRemote && get().mode === "online" && send) send(action);
      },
      reset: () => set({ roomId: null, state: null, mode: "local", viewerId: "P1" })
    }),
    {
      name: "hanabi-web-store",
      partialize: (s) => ({ mode: s.mode, roomId: s.roomId, viewerId: s.viewerId, state: s.state })
    }
  )
);

