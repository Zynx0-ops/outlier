import type { Answer, Prompt } from './types';

const WORD_SWAPS: Record<string, string> = {
  saint: 'st',
  mount: 'mt',
  and: '',
  of: '',
  the: '',
};

/** Reduce a guess or an accepted spelling to a comparable key. */
export function normalize(raw: string): string {
  const words = raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/['’`.]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  if (words.length > 1 && ['a', 'an'].includes(words[0])) words.shift();
  return words.map((w) => WORD_SWAPS[w] ?? w).join('');
}

/** Optimal string alignment distance, bailing out once `max` is exceeded. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2 = new Array<number>(b.length + 1).fill(0);
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
    prev2.splice(0, prev2.length, ...prev);
    prev = cur;
  }
  return prev[b.length];
}

const allowedTypos = (len: number): number => (len <= 4 ? 0 : len <= 7 ? 1 : 2);

export class AnswerIndex {
  private exact = new Map<string, Answer>();
  private keys: { key: string; answer: Answer }[] = [];

  constructor(prompt: Prompt) {
    for (const answer of prompt.answers) {
      for (const spelling of answer.spellings) {
        const key = normalize(spelling);
        if (!key) continue;
        this.exact.set(key, answer);
        this.keys.push({ key, answer });
      }
    }
  }

  /** Returns the matched answer, or null if the guess is unknown or ambiguous. */
  match(guess: string): Answer | null {
    const key = normalize(guess);
    if (!key) return null;

    for (const variant of [key, key.replace(/es$/, ''), key.replace(/s$/, ''), key + 's']) {
      const hit = this.exact.get(variant);
      if (hit) return hit;
    }

    const max = allowedTypos(key.length);
    if (max === 0) return null;

    let best: Answer | null = null;
    let bestDist = max + 1;
    let tied = false;
    for (const { key: candidate, answer } of this.keys) {
      if (allowedTypos(candidate.length) === 0) continue;
      const d = editDistance(key, candidate, max);
      if (d < bestDist) {
        best = answer;
        bestDist = d;
        tied = false;
      } else if (d === bestDist && answer !== best) {
        tied = true;
      }
    }
    return bestDist <= max && !tied ? best : null;
  }
}
