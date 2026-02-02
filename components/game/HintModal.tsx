"use client";

import { useMemo, useState } from "react";
import { COLORS, RANKS } from "@/lib/hanabi/constants";
import type { Color, HintKind, PlayerId, Rank } from "@/lib/hanabi/types";
import clsx from "clsx";

export function HintModal({
  open,
  onClose,
  actor,
  targets,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  actor: PlayerId;
  targets: { id: PlayerId; name: string }[];
  onSubmit: (payload: { to: PlayerId; kind: HintKind; value: Color | Rank }) => void;
}) {
  const [to, setTo] = useState<PlayerId>(targets[0]?.id ?? "P2");
  const [kind, setKind] = useState<HintKind>("color");
  const [color, setColor] = useState<Color>("R");
  const [rank, setRank] = useState<Rank>(1);

  const toOptions = useMemo(() => targets.filter((p) => p.id !== actor), [targets, actor]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="glass w-full max-w-md rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">힌트 주기</div>
          <button className="btn-ghost px-3 py-2 text-sm" onClick={onClose}>
            닫기
          </button>
        </div>

        <div className="mt-3 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-200/70">대상</span>
            <select className="glass rounded-xl px-3 py-2" value={to} onChange={(e) => setTo(e.target.value as PlayerId)}>
              {toOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              className={clsx("btn", kind === "color" ? "btn-primary" : "btn-ghost")}
              onClick={() => setKind("color")}
              type="button"
            >
              색
            </button>
            <button
              className={clsx("btn", kind === "rank" ? "btn-primary" : "btn-ghost")}
              onClick={() => setKind("rank")}
              type="button"
            >
              숫자
            </button>
          </div>

          {kind === "color" ? (
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={clsx("btn px-2 py-2 text-sm", color === c ? "btn-primary" : "btn-ghost")}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {RANKS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={clsx("btn px-2 py-2 text-sm", rank === r ? "btn-primary" : "btn-ghost")}
                  onClick={() => setRank(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={() => {
              onSubmit({ to, kind, value: kind === "color" ? color : rank });
              onClose();
            }}
          >
            힌트 사용
          </button>
        </div>
      </div>
    </div>
  );
}

