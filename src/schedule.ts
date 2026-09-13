export const ROUNDS = 7;
export const LAUNCH_DATE = '2026-09-13';

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(items: readonly T[], seed: string): T[] {
  const rand = mulberry32(hashString(seed));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Local calendar date as YYYY-MM-DD. */
export function dateKey(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const keyToUtc = (key: string): number => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((keyToUtc(toKey) - keyToUtc(fromKey)) / 86_400_000);
}

/** Launch day is #1. */
export const dayNumber = (key: string): number => daysBetween(LAUNCH_DATE, key) + 1;

/**
 * Everyone gets the same prompts on the same day: walk a fixed shuffle of the
 * pool in windows of ROUNDS, so prompts don't repeat until the pool is exhausted.
 */
export function dailyIds(key: string, poolIds: readonly string[]): string[] {
  const order = shuffled(poolIds, 'outlier-daily-v1');
  const start = (((dayNumber(key) - 1) * ROUNDS) % order.length + order.length) % order.length;
  return Array.from({ length: Math.min(ROUNDS, order.length) }, (_, i) => order[(start + i) % order.length]);
}

export const seededIds = (seed: string, poolIds: readonly string[]): string[] =>
  shuffled(poolIds, `outlier-seed-${seed}`).slice(0, ROUNDS);

export function randomSeed(): string {
  return Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, '0');
}
