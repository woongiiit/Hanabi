export type Color = "R" | "G" | "B" | "Y" | "W";
export type Rank = 1 | 2 | 3 | 4 | 5;

export type PlayerId = string;

export type Card = {
  id: string;
  color: Color;
  rank: Rank;
  knownColor?: Color;
  knownRank?: Rank;
};

export type Fireworks = Record<Color, number>; // 0..5 (top rank)

export type GameLogEntry = {
  id: string;
  t: number;
  text: string;
};

export type GameOverReason = "lives" | "completed" | "final_turns";

export type GameState = {
  version: number;
  roomId: string;
  seed: number;
  createdAt: number;

  players: { id: PlayerId; name: string }[];
  currentPlayerIndex: number;

  deck: Card[];
  hands: Record<PlayerId, Card[]>;
  discard: Card[];
  fireworks: Fireworks;

  hintTokens: number; // 0..8
  lifeTokens: number; // 0..3

  turn: number;
  finalTurnsRemaining: number | null; // once deck empties, set to players.length

  log: GameLogEntry[];
  lastEffect?: { kind: "firework"; color: Color; rank: Rank; t: number };

  gameOver: null | { reason: GameOverReason; score: number; t: number };
};

export type HintKind = "color" | "rank";

export type GameAction =
  | { id: string; t: number; type: "START"; payload: { roomId: string; playerCount: number; names?: string[]; seed?: number } }
  | { id: string; t: number; type: "SET_NAMES"; payload: { names: string[] } }
  | { id: string; t: number; type: "GIVE_HINT"; actor: PlayerId; payload: { to: PlayerId; kind: HintKind; value: Color | Rank } }
  | { id: string; t: number; type: "PLAY_CARD"; actor: PlayerId; payload: { index: number } }
  | { id: string; t: number; type: "DISCARD_CARD"; actor: PlayerId; payload: { index: number } };

