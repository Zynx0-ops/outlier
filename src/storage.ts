import { daysBetween } from './schedule';
import type { RoundResult } from './types';

export interface GameRecord {
  score: number;
  rounds: RoundResult[];
}

export interface DailyRecord extends GameRecord {
  date: string;
  day: number;
}

export interface Profile {
  daily: Record<string, DailyRecord>;
  streak: number;
  bestStreak: number;
  lastDaily: string | null;
  unlimitedPlayed: number;
  unlimitedBest: number;
  seenIntro: boolean;
}

const KEY = 'outlier:v1';

export const emptyProfile = (): Profile => ({
  daily: {},
  streak: 0,
  bestStreak: 0,
  lastDaily: null,
  unlimitedPlayed: 0,
  unlimitedBest: 0,
  seenIntro: false,
});

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...emptyProfile(), ...JSON.parse(raw) };
  } catch {
    // Private mode or corrupt data: start fresh.
  }
  return emptyProfile();
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // Storage unavailable; progress just won't persist.
  }
}

export function recordDaily(profile: Profile, record: DailyRecord): Profile {
  if (profile.daily[record.date]) return profile;
  const continues = profile.lastDaily !== null && daysBetween(profile.lastDaily, record.date) === 1;
  const streak = continues ? profile.streak + 1 : 1;
  return {
    ...profile,
    daily: { ...profile.daily, [record.date]: record },
    streak,
    bestStreak: Math.max(profile.bestStreak, streak),
    lastDaily: record.date,
  };
}

export function recordUnlimited(profile: Profile, score: number): Profile {
  return {
    ...profile,
    unlimitedPlayed: profile.unlimitedPlayed + 1,
    unlimitedBest: Math.max(profile.unlimitedBest, score),
  };
}

/** A streak survives until a full calendar day is skipped. */
export function liveStreak(profile: Profile, today: string): number {
  if (!profile.lastDaily) return 0;
  return daysBetween(profile.lastDaily, today) <= 1 ? profile.streak : 0;
}
