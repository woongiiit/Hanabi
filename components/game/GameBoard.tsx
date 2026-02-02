"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { getCurrentPlayerId, score } from "@/lib/hanabi/engine";
import { FireworksBoard } from "@/components/game/Fireworks";
import { TokenBar } from "@/components/game/TokenBar";
import { ActionLog } from "@/components/game/ActionLog";
import { CardBack, CardFace } from "@/components/game/CardView";
import { HintModal } from "@/components/game/HintModal";
import { FireworkBurst } from "@/components/game/FireworkBurst";
import type { PlayerId } from "@/lib/hanabi/types";

export function GameBoard() {
  const { state, viewerId, dispatch } = useGameStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hintOpen, setHintOpen] = useState(false);

  const s = state;
  const current = s ? getCurrentPlayerId(s) : "P1";
  const isMyTurn = viewerId === current;

  const meHand = s?.hands[viewerId] ?? [];
  const others = useMemo(() => {
    if (!s) return [];
    return s.players.filter((p) => p.id !== viewerId);
  }, [s, viewerId]);

  if (!s) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="text-slate-200/80">게임 상태가 없습니다. 홈에서 새 게임을 시작하세요.</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <TokenBar hintTokens={s.hintTokens} lifeTokens={s.lifeTokens} deckCount={s.deck.length} discardCount={s.discard.length} />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative">
              <FireworksBoard fireworks={s.fireworks} />
              {s.lastEffect?.kind === "firework" ? (
                <FireworkBurst color={s.lastEffect.color} rank={s.lastEffect.rank} t={s.lastEffect.t} />
              ) : null}
            </div>

            <div className="glass rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-slate-300/80">Turn</div>
                <div className="text-xs text-slate-200/70">점수 {score(s)}</div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">
                  현재 차례: <span className="font-semibold">{current}</span>
                </div>
                <div className="text-xs text-slate-200/70">
                  {s.finalTurnsRemaining !== null ? `마지막 턴 남음: ${s.finalTurnsRemaining}` : `턴 ${s.turn}`}
                </div>
              </div>
              {s.gameOver ? (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <div className="font-semibold">게임 종료</div>
                  <div className="mt-1 text-slate-200/80">
                    사유: {s.gameOver.reason} / 점수: {s.gameOver.score}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="glass rounded-2xl p-3">
            <div className="text-xs uppercase tracking-widest text-slate-300/80">Other players</div>
            <div className="mt-2 space-y-3">
              {others.map((p) => (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      {p.name} <span className="text-xs text-slate-200/70">({p.id})</span>
                    </div>
                    <div className="text-xs text-slate-200/70">손패 {s.hands[p.id]?.length ?? 0}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(s.hands[p.id] ?? []).map((card) => (
                      <CardFace key={card.id} card={card} compact />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden">
            <ActionLog log={s.log} />
          </div>
        </div>

        <div className="hidden lg:block">
          <ActionLog log={s.log} />
        </div>
      </div>

      {/* bottom fixed: my hand + actions */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto max-w-6xl">
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-slate-300/80">My hand</div>
                <div className="mt-1 text-sm text-slate-200/80">
                  {isMyTurn ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-100">내 차례</span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-white/80">대기중</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="btn-ghost px-3 py-2 text-sm" disabled={!isMyTurn || s.hintTokens <= 0} onClick={() => setHintOpen(true)}>
                  힌트
                </button>
                <button
                  className="btn-primary px-3 py-2 text-sm"
                  disabled={!isMyTurn || selectedIndex === null}
                  onClick={() => {
                    if (selectedIndex === null) return;
                    dispatch({ type: "PLAY_CARD", actor: viewerId, payload: { index: selectedIndex } });
                    setSelectedIndex(null);
                  }}
                >
                  내려놓기
                </button>
                <button
                  className="btn-ghost px-3 py-2 text-sm"
                  disabled={!isMyTurn || selectedIndex === null}
                  onClick={() => {
                    if (selectedIndex === null) return;
                    dispatch({ type: "DISCARD_CARD", actor: viewerId, payload: { index: selectedIndex } });
                    setSelectedIndex(null);
                  }}
                >
                  버리기
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {meHand.map((card, idx) => (
                <CardBack
                  key={card.id}
                  card={card}
                  selected={selectedIndex === idx}
                  onClick={() => setSelectedIndex((cur) => (cur === idx ? null : idx))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-40" />

      <HintModal
        open={hintOpen}
        onClose={() => setHintOpen(false)}
        actor={viewerId as PlayerId}
        targets={s.players}
        onSubmit={(payload) => dispatch({ type: "GIVE_HINT", actor: viewerId, payload })}
      />
    </div>
  );
}

