"use client";

import { motion } from "framer-motion";
import type { Color, Rank } from "@/lib/hanabi/types";

const COLOR_GLOW: Record<Color, string> = {
  R: "rgba(255, 90, 90, 0.6)",
  G: "rgba(60, 255, 160, 0.55)",
  B: "rgba(90, 160, 255, 0.6)",
  Y: "rgba(255, 230, 100, 0.55)",
  W: "rgba(255, 255, 255, 0.45)"
};

export function FireworkBurst({ color, rank, t }: { color: Color; rank: Rank; t: number }) {
  const particles = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 14,
    dist: 40 + Math.random() * 20
  }));

  return (
    <div key={t} className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ background: COLOR_GLOW[color], boxShadow: `0 0 14px ${COLOR_GLOW[color]}` }}
          initial={{ x: 0, y: 0, opacity: 0.0, scale: 0.8 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: [0.0, 1.0, 0.0],
            scale: [0.8, 1.1, 0.5]
          }}
          transition={{ duration: 0.9 + rank * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

