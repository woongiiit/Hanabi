"use client";

import type { GameLogEntry } from "@/lib/hanabi/types";

export function ActionLog({ log }: { log: GameLogEntry[] }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-slate-300/80">Log</div>
        <div className="text-[10px] text-slate-200/60">{log.length} entries</div>
      </div>
      <div className="mt-2 max-h-44 space-y-1 overflow-auto pr-1 text-xs text-slate-200/80">
        {log.slice().reverse().map((e) => (
          <div key={e.id} className="rounded-lg bg-white/5 px-2 py-1">
            {e.text}
          </div>
        ))}
      </div>
    </div>
  );
}

