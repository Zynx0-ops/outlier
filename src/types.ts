export type TierId = 'obvious' | 'clever' | 'uncommon' | 'rare' | 'deep' | 'outlier';

export interface Tier {
  id: TierId;
  name: string;
  points: number;
  emoji: string;
  blurb: string;
}

/** Ordered from least to most rare. */
export const TIERS: readonly Tier[] = [
  { id: 'obvious', name: 'Obvious', points: 10, emoji: '⬜', blurb: 'Half the planet said this.' },
  { id: 'clever', name: 'Galaxy Brain', points: 15, emoji: '🟦', blurb: 'The “obscure” pick everyone thinks only they know.' },
  { id: 'uncommon', name: 'Uncommon', points: 30, emoji: '🟩', blurb: 'Off the beaten path.' },
  { id: 'rare', name: 'Rare', points: 60, emoji: '🟨', blurb: 'Most people never get here.' },
  { id: 'deep', name: 'Deep Space', points: 85, emoji: '🟧', blurb: 'A genuinely deep cut.' },
  { id: 'outlier', name: 'Outlier', points: 100, emoji: '🌟', blurb: 'The hand-picked gem. One in a billion.' },
];

export const MISS_EMOJI = '⬛';

export const tierById = (id: TierId): Tier => TIERS.find((t) => t.id === id)!;
export const tierIndex = (id: TierId): number => TIERS.findIndex((t) => t.id === id);

/**
 * Compact authoring format. Each tier is a `;`-separated list of answers;
 * each answer is a `/`-separated list of accepted spellings (first is the display name).
 */
export interface PromptDef {
  id: string;
  text: string;
  cat: string;
  hint?: string;
  obvious: string;
  clever?: string;
  uncommon: string;
  rare: string;
  deep: string;
  outlier: string;
}

export interface Answer {
  display: string;
  spellings: string[];
  tier: TierId;
}

export interface Prompt {
  id: string;
  text: string;
  cat: string;
  hint?: string;
  answers: Answer[];
  outlier: Answer;
}

export interface RoundResult {
  promptId: string;
  input: string;
  answer: string | null;
  tier: TierId | null;
  points: number;
}
