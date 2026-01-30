type RateLimitState = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitState>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const state = buckets.get(key);

  if (!state || now >= state.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: windowMs };
  }

  if (state.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: state.resetAt - now };
  }

  state.count += 1;
  return { ok: true, remaining: limit - state.count, retryAfterMs: state.resetAt - now };
}

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
