import { altitudeKm, formatAltitude, landmarkAt, MAX_SCORE } from './altitude';
import { MISS_EMOJI, TIERS, tierIndex, type RoundResult } from './types';

/** 0 = miss, 1..6 = tier index + 1. */
export const tierDigits = (rounds: RoundResult[]): number[] =>
  rounds.map((r) => (r.tier ? tierIndex(r.tier) + 1 : 0));

export const scoreFromDigits = (digits: number[]): number =>
  digits.reduce((sum, d) => sum + (d > 0 ? TIERS[d - 1].points : 0), 0);

export const emojiRow = (digits: number[]): string =>
  digits.map((d) => (d > 0 ? TIERS[d - 1].emoji : MISS_EMOJI)).join('');

export function shareText(label: string, rounds: RoundResult[], url: string): string {
  const digits = tierDigits(rounds);
  const score = scoreFromDigits(digits);
  const km = altitudeKm(score);
  return [
    `Outlier ${label} · ${score}/${MAX_SCORE}`,
    `🚀 ${formatAltitude(km)} — ${landmarkAt(km).label}`,
    emojiRow(digits),
    url,
  ].join('\n');
}

export interface Challenge {
  seed: string;
  digits: number[];
}

export const challengeHash = (seed: string, rounds: RoundResult[]): string =>
  `#c=${seed}.${tierDigits(rounds).join('')}`;

export function parseChallenge(hash: string): Challenge | null {
  const m = /^#c=([a-z0-9]{1,12})(?:\.([0-6]{1,7}))?$/.exec(hash);
  if (!m) return null;
  return { seed: m[1], digits: m[2] ? [...m[2]].map(Number) : [] };
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}
