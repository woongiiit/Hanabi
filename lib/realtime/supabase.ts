import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

type PublicSupabaseConfig = { url: string; anon: string };

function readPublicConfig(): PublicSupabaseConfig | null {
  // Prefer runtime-injected config (Railway Docker builds often don't have NEXT_PUBLIC_* at build time)
  const g = globalThis as any;
  const injected = g?.__HANABI_SUPABASE__ as Partial<PublicSupabaseConfig> | undefined;
  const url = (typeof injected?.url === "string" && injected.url) || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = (typeof injected?.anon === "string" && injected.anon) || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return { url, anon };
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const cfg = readPublicConfig();
  if (!cfg) {
    cached = null;
    return cached;
  }

  cached = createClient(cfg.url, cfg.anon, {
    realtime: { params: { eventsPerSecond: 10 } }
  });
  return cached;
}

