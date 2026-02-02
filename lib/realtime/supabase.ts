import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    cached = null;
    return cached;
  }
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      cached = null;
      return cached;
    }
  } catch {
    cached = null;
    return cached;
  }

  cached = createClient(url, anon, {
    realtime: { params: { eventsPerSecond: 10 } }
  });
  return cached;
}

