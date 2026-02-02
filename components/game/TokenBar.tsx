"use client";

export function TokenBar({
  hintTokens,
  lifeTokens,
  deckCount,
  discardCount
}: {
  hintTokens: number;
  lifeTokens: number;
  deckCount: number;
  discardCount: number;
}) {
  return (
    <div className="glass flex items-center justify-between gap-3 rounded-2xl p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-slate-300/80">Tokens</span>
        <span className="rounded-full bg-sky-500/15 px-2 py-1 text-sky-100">힌트 {hintTokens}/8</span>
        <span className="rounded-full bg-rose-500/15 px-2 py-1 text-rose-100">생명 {lifeTokens}/3</span>
      </div>
      <div className="flex items-center gap-2 text-slate-200/80">
        <span className="rounded-full bg-white/10 px-2 py-1">덱 {deckCount}</span>
        <span className="rounded-full bg-white/10 px-2 py-1">버림 {discardCount}</span>
      </div>
    </div>
  );
}

