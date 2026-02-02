import type { Color, Fireworks, Rank } from "./types";

export const COLORS: Color[] = ["R", "G", "B", "Y", "W"];
export const RANKS: Rank[] = [1, 2, 3, 4, 5];

export const RANK_COUNTS: Record<Rank, number> = {
  1: 3,
  2: 2,
  3: 2,
  4: 2,
  5: 1
};

export const MAX_HINT_TOKENS = 8;
export const MAX_LIFE_TOKENS = 3;

export const EMPTY_FIREWORKS: Fireworks = {
  R: 0,
  G: 0,
  B: 0,
  Y: 0,
  W: 0
};

