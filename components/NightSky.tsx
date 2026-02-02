"use client";

import { motion } from "framer-motion";

export function NightSky() {
  // subtle twinkling stars (pure CSS-like, no canvas)
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    opacity: 0.2 + Math.random() * 0.6
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.25))"
          }}
          animate={{ opacity: [s.opacity * 0.4, s.opacity, s.opacity * 0.5] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

