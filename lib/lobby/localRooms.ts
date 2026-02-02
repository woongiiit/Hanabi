"use client";

import type { RoomSummary } from "./types";

const KEY = "hanabi-web-rooms";

export function readLocalRooms(): RoomSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RoomSummary[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalRooms(rooms: RoomSummary[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rooms.slice(0, 100)));
}

export function upsertLocalRoom(room: RoomSummary) {
  const rooms = readLocalRooms();
  const next = [room, ...rooms.filter((r) => r.id !== room.id)].slice(0, 100);
  writeLocalRooms(next);
}

