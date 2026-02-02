import { COLORS, EMPTY_FIREWORKS, MAX_HINT_TOKENS, MAX_LIFE_TOKENS, RANKS, RANK_COUNTS } from "./constants";
import type { Card, Color, GameAction, GameState, PlayerId, Rank } from "./types";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function createDeck(seed: number): Card[] {
  const cards: Card[] = [];
  for (const c of COLORS) {
    for (const r of RANKS) {
      for (let i = 0; i < RANK_COUNTS[r]; i++) {
        cards.push({ id: uid(`C_${c}${r}_`), color: c, rank: r });
      }
    }
  }
  return shuffle(cards, mulberry32(seed));
}

export function initialStateFromStart(action: Extract<GameAction, { type: "START" }>): GameState {
  const seed = action.payload.seed ?? Math.floor(Math.random() * 2 ** 31);
  const playerCount = clamp(action.payload.playerCount, 2, 5);
  const names = action.payload.names ?? Array.from({ length: playerCount }).map((_, i) => `P${i + 1}`);
  const roomId = action.payload.roomId;

  const players = Array.from({ length: playerCount }).map((_, i) => ({
    id: `P${i + 1}`,
    name: names[i] ?? `P${i + 1}`
  }));

  let deck = createDeck(seed);
  const handSize = playerCount <= 3 ? 5 : 4;
  const hands: Record<PlayerId, Card[]> = {};
  for (const p of players) hands[p.id] = [];
  for (let k = 0; k < handSize; k++) {
    for (const p of players) {
      const card = deck.shift();
      if (card) hands[p.id].push(card);
    }
  }

  return {
    version: 0,
    roomId,
    seed,
    createdAt: action.t,
    players,
    currentPlayerIndex: 0,
    deck,
    hands,
    discard: [],
    fireworks: { ...EMPTY_FIREWORKS },
    hintTokens: MAX_HINT_TOKENS,
    lifeTokens: MAX_LIFE_TOKENS,
    turn: 1,
    finalTurnsRemaining: null,
    log: [{ id: uid("L_"), t: action.t, text: `게임 시작 (인원 ${playerCount})` }],
    gameOver: null
  };
}

export function score(state: GameState) {
  return COLORS.reduce((sum, c) => sum + state.fireworks[c], 0);
}

export function getCurrentPlayerId(state: GameState): PlayerId {
  return state.players[state.currentPlayerIndex]?.id ?? "P1";
}

export function canPlayToFirework(state: GameState, card: Card) {
  return state.fireworks[card.color] + 1 === card.rank;
}

export function isCompleted(state: GameState) {
  return COLORS.every((c) => state.fireworks[c] === 5);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function addLog(state: GameState, text: string, t: number) {
  state.log = [...state.log, { id: uid("L_"), t, text }].slice(-200);
}

function endGame(state: GameState, reason: GameState["gameOver"] extends null ? never : any, t: number) {
  if (state.gameOver) return;
  state.gameOver = { reason, score: score(state), t };
  addLog(state, `게임 종료 (${reason}) - 점수 ${state.gameOver.score}`, t);
}

export function reduce(state: GameState | null, action: GameAction): GameState {
  if (action.type === "START") return initialStateFromStart(action);
  if (!state) return state as any;
  if (state.gameOver) return state;

  const s: GameState = structuredClone(state);
  s.version = state.version + 1;

  if (action.type === "SET_PLAYER_NAME") {
    const { playerId, name } = action.payload;
    s.players = s.players.map((p) => (p.id === playerId ? { ...p, name } : p));
    addLog(s, `${playerId} 닉네임 변경: ${name}`, action.t);
    return s;
  }

  if (action.type === "SET_NAMES") {
    const names = action.payload.names;
    s.players = s.players.map((p, i) => ({ ...p, name: names[i] ?? p.name }));
    addLog(s, "플레이어 이름이 변경되었습니다.", action.t);
    return s;
  }

  const current = getCurrentPlayerId(s);
  const actor = (action as any).actor as PlayerId | undefined;
  if (actor && actor !== current) {
    addLog(s, `무효: 지금은 ${current} 차례입니다.`, action.t);
    return s;
  }

  switch (action.type) {
    case "GIVE_HINT": {
      if (s.hintTokens <= 0) {
        addLog(s, "무효: 힌트 토큰이 없습니다.", action.t);
        return s;
      }
      const { to, kind, value } = action.payload;
      if (to === action.actor) {
        addLog(s, "무효: 자신에게 힌트를 줄 수 없습니다.", action.t);
        return s;
      }
      const targetHand = s.hands[to];
      if (!targetHand) {
        addLog(s, "무효: 대상 플레이어가 없습니다.", action.t);
        return s;
      }

      let hits = 0;
      const updated = targetHand.map((card) => {
        if (kind === "color" && card.color === value) {
          hits++;
          return { ...card, knownColor: card.color };
        }
        if (kind === "rank" && card.rank === value) {
          hits++;
          return { ...card, knownRank: card.rank };
        }
        return card;
      });

      if (hits === 0) {
        addLog(s, "무효: 해당 힌트로 표시되는 카드가 없습니다.", action.t);
        return s;
      }

      s.hands = { ...s.hands, [to]: updated };
      s.hintTokens = s.hintTokens - 1;
      const v = kind === "color" ? (value as Color) : (value as Rank);
      addLog(s, `${action.actor} → ${to}: ${kind === "color" ? "색" : "숫자"} 힌트 (${String(v)})`, action.t);
      advanceTurnAndMaybeEnd(s, action.t);
      return s;
    }
    case "PLAY_CARD": {
      const hand = s.hands[action.actor];
      if (!hand) return s;
      const idx = action.payload.index;
      const card = hand[idx];
      if (!card) {
        addLog(s, "무효: 선택한 카드가 없습니다.", action.t);
        return s;
      }

      const nextHand = [...hand.slice(0, idx), ...hand.slice(idx + 1)];
      s.hands = { ...s.hands, [action.actor]: nextHand };

      if (canPlayToFirework(s, card)) {
        s.fireworks = { ...s.fireworks, [card.color]: card.rank };
        s.lastEffect = { kind: "firework", color: card.color, rank: card.rank, t: action.t };
        addLog(s, `${action.actor} 플레이 성공: ${card.color}${card.rank}`, action.t);
        if (card.rank === 5 && s.hintTokens < MAX_HINT_TOKENS) {
          s.hintTokens++;
          addLog(s, "5 완성 보너스: 힌트 토큰 +1", action.t);
        }
      } else {
        s.lifeTokens--;
        s.discard = [...s.discard, card];
        addLog(s, `${action.actor} 플레이 실패: ${card.color}${card.rank} (생명 -1)`, action.t);
        if (s.lifeTokens <= 0) {
          endGame(s, "lives", action.t);
          return s;
        }
      }

      drawIfPossible(s, action.actor, action.t);
      if (isCompleted(s)) {
        endGame(s, "completed", action.t);
        return s;
      }
      advanceTurnAndMaybeEnd(s, action.t);
      return s;
    }
    case "DISCARD_CARD": {
      const hand = s.hands[action.actor];
      if (!hand) return s;
      const idx = action.payload.index;
      const card = hand[idx];
      if (!card) {
        addLog(s, "무효: 선택한 카드가 없습니다.", action.t);
        return s;
      }

      const nextHand = [...hand.slice(0, idx), ...hand.slice(idx + 1)];
      s.hands = { ...s.hands, [action.actor]: nextHand };
      s.discard = [...s.discard, card];

      if (s.hintTokens < MAX_HINT_TOKENS) s.hintTokens++;
      addLog(s, `${action.actor} 버림: ${card.color}${card.rank} (힌트 +1)`, action.t);

      drawIfPossible(s, action.actor, action.t);
      advanceTurnAndMaybeEnd(s, action.t);
      return s;
    }
    default:
      return s;
  }
}

function drawIfPossible(state: GameState, who: PlayerId, t: number) {
  if (state.deck.length <= 0) return;
  const card = state.deck.shift();
  if (!card) return;
  state.hands = { ...state.hands, [who]: [...state.hands[who], card] };
  if (state.deck.length === 0 && state.finalTurnsRemaining === null) {
    state.finalTurnsRemaining = state.players.length;
    addLog(state, "덱이 비었습니다. 각 플레이어 1턴씩 남았습니다.", t);
  }
}

function advanceTurnAndMaybeEnd(state: GameState, t: number) {
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  state.turn++;

  if (state.finalTurnsRemaining !== null) {
    state.finalTurnsRemaining = state.finalTurnsRemaining - 1;
    if (state.finalTurnsRemaining <= 0) {
      endGame(state, "final_turns", t);
    }
  }
}

export function maskForViewer(state: GameState, viewerId: PlayerId): GameState {
  // UI 필터링: viewer의 손패는 값 숨김(knownColor/knownRank만 유지)
  const s: GameState = structuredClone(state);
  const hand = s.hands[viewerId];
  if (hand) {
    s.hands[viewerId] = hand.map((c) => ({
      id: c.id,
      color: c.color, // keep internally but masked render uses flags; still present in object
      rank: c.rank,
      knownColor: c.knownColor,
      knownRank: c.knownRank
    }));
  }
  return s;
}

