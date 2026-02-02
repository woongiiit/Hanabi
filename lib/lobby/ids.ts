"use client";

export function randomRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function randomKey(prefix = "K") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

