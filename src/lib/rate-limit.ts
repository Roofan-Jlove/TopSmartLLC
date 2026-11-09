/**
 * In-memory sliding window per key. Good enough for v1; on serverless the
 * counters reset on cold start. Upgrade path: Upstash Redis / Vercel KV.
 */
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, limit: number, now: number = Date.now()): RateLimitResult {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= limit) {
    hits.set(key, recent);
    const oldest = recent[0] ?? now;
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(k);
    }
  }
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}
