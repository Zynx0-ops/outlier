import { PROMPT_IDS, promptById } from './data';
import { dailyIds, dateKey, dayNumber, seededIds } from './schedule';
import type { Challenge } from './share';
import { setProfile, state } from './state';
import { recordDaily, recordUnlimited } from './storage';
import type { Prompt, RoundResult } from './types';
import type { Tab } from './ui';

export interface Game {
  mode: 'daily' | 'unlimited';
  date: string;
  seed: string;
  prompts: Prompt[];
  rounds: RoundResult[];
  challenge: Challenge | null;
  saved: boolean;
  /** Tab to go back to when the report is dismissed. */
  returnTo: Tab;
}

const loadPrompts = (ids: string[]): Prompt[] =>
  ids.map((id) => promptById(id)).filter((p): p is Prompt => !!p);

export const total = (rounds: RoundResult[]): number => rounds.reduce((sum, r) => sum + r.points, 0);

export function dailyGame(date = dateKey(), returnTo: Tab = 'play'): Game {
  const record = state.profile.daily[date];
  return {
    mode: 'daily',
    date,
    seed: date,
    prompts: loadPrompts(record ? record.rounds.map((r) => r.promptId) : dailyIds(date, PROMPT_IDS)),
    rounds: record ? [...record.rounds] : [],
    challenge: null,
    saved: !!record,
    returnTo,
  };
}

export function unlimitedGame(seed: string, challenge: Challenge | null = null): Game {
  return {
    mode: 'unlimited',
    date: dateKey(),
    seed,
    prompts: loadPrompts(seededIds(seed, PROMPT_IDS)),
    rounds: [],
    challenge,
    saved: false,
    returnTo: 'play',
  };
}

export function saveGame(game: Game): void {
  if (game.saved) return;
  game.saved = true;
  const score = total(game.rounds);
  setProfile(
    game.mode === 'daily'
      ? recordDaily(state.profile, { date: game.date, day: dayNumber(game.date), score, rounds: game.rounds })
      : recordUnlimited(state.profile, game.rounds, score),
  );
}
