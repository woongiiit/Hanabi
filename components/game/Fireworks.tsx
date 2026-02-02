"use client";

import type { Color, Fireworks } from "@/lib/hanabi/types";
import { COLORS } from "@/lib/hanabi/constants";
import clsx from "clsx";

const COLOR_LABEL: Record<Color, string> = { R: "빨강", G: "초록", B: "파랑", Y: "노랑", W: "하양" };

export function FireworksBoard({ fireworks }: { fireworks: Fireworks }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-xs uppercase tracking-widest text-slate-300/80">Fireworks</div>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {COLORS.map((c) => (
          <div key={c} className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
            <div className="text-[10px] text-slate-200/70">{COLOR_LABEL[c]}</div>
            <div className={clsx("mt-1 text-lg font-semibold", fireworks[c] === 0 ? "text-white/40" : "text-white")}>
              {fireworks[c] || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

