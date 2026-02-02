"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PreferredMode = "auto" | "online" | "local";

type ProfileStore = {
  nickname: string;
  preferredMode: PreferredMode;
  setNickname: (nickname: string) => void;
  setPreferredMode: (mode: PreferredMode) => void;
  resetProfile: () => void;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      nickname: "",
      preferredMode: "auto",
      setNickname: (nickname) => set({ nickname }),
      setPreferredMode: (preferredMode) => set({ preferredMode }),
      resetProfile: () => set({ nickname: "", preferredMode: "auto" })
    }),
    { name: "hanabi-web-profile" }
  )
);

