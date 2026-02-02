"use client";

import clsx from "clsx";
import type { Card, Color, Rank } from "@/lib/hanabi/types";

const COLOR_NAME: Record<Color, string> = {
  R: "Red",
  G: "Green",
  B: "Blue",
  Y: "Yellow",
  W: "White"
};

export function CardFace({ card, compact }: { card: Card; compact?: boolean }) {
  return (
    <div
      className={clsx(
        "relative flex select-none items-center justify-center rounded-xl border border-white/10",
        "bg-white/5 shadow-glow",
        compact ? "h-16 w-11 text-xs" : "h-20 w-14 text-sm"
      )}
    >
      <div className="absolute left-2 top-2 text-[10px] text-white/80">{card.color}</div>
      <div className="text-xl font-semibold">{card.rank}</div>
      <div className="absolute bottom-2 right-2 text-[10px] text-white/60">{COLOR_NAME[card.color]}</div>
    </div>
  );
}

export function CardBack({
  card,
  selected,
  onClick
}: {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
}) {
  const hintText = formatHints(card.knownColor, card.knownRank);
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative flex h-20 w-14 flex-col items-center justify-center rounded-xl border text-sm transition",
        selected ? "border-white/40 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
      )}
    >
      <div className="text-[10px] uppercase tracking-widest text-white/60">Hanabi</div>
      <div className="mt-1 h-6 w-6 rounded-full bg-gradient-to-br from-sky-300/40 to-fuchsia-300/30" />
      <div className="mt-1 text-[10px] text-white/80">{hintText}</div>
    </button>
  );
}

function formatHints(c?: Color, r?: Rank) {
  if (!c && !r) return "??";
  if (c && r) return `${c}${r}`;
  if (c) return `${c}?`;
  return `?${r}`;
}

