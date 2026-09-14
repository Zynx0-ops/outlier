import { describe, expect, it } from 'vitest';
import { altitudeKm, kmToPoints, MAX_SCORE, MOON_KM } from '../src/altitude';
import { PROMPTS, PROMPT_IDS, promptById } from '../src/data';
import { ICON_SPRITES } from '../src/icons';
import * as sprites from '../src/sprites';
import { AnswerIndex, normalize } from '../src/match';
import { dailyIds, dayNumber, ROUNDS, seededIds } from '../src/schedule';
import { challengeHash, parseChallenge, scoreFromDigits } from '../src/share';
import { emptyProfile, liveStreak, recordDaily, recordUnlimited } from '../src/storage';
import type { RoundResult } from '../src/types';

const matcher = (id: string) => new AnswerIndex(promptById(id)!);

describe('pixel art', () => {
  const art: [string, readonly string[]][] = [
    ...Object.entries(sprites).filter((e): e is [string, readonly string[]] => Array.isArray(e[1])),
    ...Object.entries(ICON_SPRITES),
  ];

  it.each(art)('%s is rectangular and uses palette colours', (_, rows) => {
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row).toHaveLength(rows[0].length);
      for (const ch of row) expect(ch === '.' || ch === '#' || ch in sprites.PALETTE, `unknown pixel "${ch}"`).toBe(true);
    }
  });
});

describe('prompt data', () => {
  it('has unique prompt ids', () => {
    expect(new Set(PROMPT_IDS).size).toBe(PROMPT_IDS.length);
  });

  it.each(PROMPTS.map((p) => [p.id, p] as const))('%s is well formed', (_, prompt) => {
    expect(prompt.answers.filter((a) => a.tier === 'outlier')).toHaveLength(1);
    expect(prompt.answers.length).toBeGreaterThanOrEqual(10);

    const owner = new Map<string, string>();
    for (const answer of prompt.answers) {
      for (const spelling of answer.spellings) {
        const key = normalize(spelling);
        expect(key, `empty key for "${spelling}"`).not.toBe('');
        const prev = owner.get(key);
        if (prev && prev !== answer.display) {
          throw new Error(`"${spelling}" collides between "${prev}" and "${answer.display}"`);
        }
        owner.set(key, answer.display);
      }
    }
  });

  it('matches every accepted spelling back to its own answer', () => {
    for (const prompt of PROMPTS) {
      const index = new AnswerIndex(prompt);
      for (const answer of prompt.answers) {
        for (const spelling of answer.spellings) {
          expect(index.match(spelling)?.display, `${prompt.id}: ${spelling}`).toBe(answer.display);
        }
      }
    }
  });
});

describe('matching', () => {
  it('forgives case, accents, articles and punctuation', () => {
    const africa = matcher('africa');
    expect(africa.match('the gambia')?.display).toBe('Gambia');
    expect(africa.match('COTE D’IVOIRE')?.display).toBe('Ivory Coast');
    expect(africa.match('sao tome & principe')?.tier).toBe('outlier');
  });

  it('forgives small typos on longer words', () => {
    expect(matcher('elements').match('Molybdinum')?.display).toBe('Molybdenum');
    expect(matcher('dog-breeds').match('dachsund')?.display).toBe('Dachshund');
  });

  it('does not fuzz short words', () => {
    expect(matcher('greek-gods').match('Pam')).toBeNull();
  });

  it('refuses ambiguous typos', () => {
    expect(matcher('pixar').match('Toy Story 9')).toBeNull();
  });

  it('keeps C, C++ and C# apart', () => {
    const langs = matcher('programming-languages');
    expect(langs.match('C')?.display).toBe('C');
    expect(langs.match('c++')?.display).toBe('C++');
    expect(langs.match('C#')?.display).toBe('C#');
  });

  it('accepts simple plurals', () => {
    expect(matcher('fruits').match('mangos')?.display).toBe('Mango');
  });

  it('rejects things not on the list', () => {
    expect(matcher('constellations').match('Big Dipper')).toBeNull();
  });
});

describe('schedule', () => {
  it('numbers launch day as #1', () => {
    expect(dayNumber('2026-09-13')).toBe(1);
    expect(dayNumber('2026-10-13')).toBe(31);
  });

  it('gives a stable, repeat-free set of prompts per day', () => {
    const a = dailyIds('2026-09-20', PROMPT_IDS);
    expect(a).toEqual(dailyIds('2026-09-20', PROMPT_IDS));
    expect(new Set(a).size).toBe(ROUNDS);
    expect(a).not.toEqual(dailyIds('2026-09-21', PROMPT_IDS));
  });

  it('gives the same seeded game to everyone', () => {
    expect(seededIds('abc123', PROMPT_IDS)).toEqual(seededIds('abc123', PROMPT_IDS));
  });
});

describe('altitude', () => {
  it('runs from the launchpad to the Moon', () => {
    expect(altitudeKm(0)).toBe(0);
    expect(altitudeKm(MAX_SCORE)).toBeCloseTo(MOON_KM);
  });

  it('maps altitude back onto the score scale the flight animation uses', () => {
    for (const score of [0, 10, 135, 350, 612, MAX_SCORE]) {
      expect(kmToPoints(altitudeKm(score))).toBeCloseTo(score);
    }
  });
});

describe('sharing', () => {
  it('round-trips a challenge link', () => {
    const rounds: RoundResult[] = [
      { promptId: 'x', input: 'a', answer: 'a', tier: 'outlier', points: 100 },
      { promptId: 'y', input: '', answer: null, tier: null, points: 0 },
      { promptId: 'z', input: 'b', answer: 'b', tier: 'obvious', points: 10 },
    ];
    const parsed = parseChallenge(challengeHash('seed42', rounds));
    expect(parsed).toEqual({ seed: 'seed42', digits: [6, 0, 1] });
    expect(scoreFromDigits(parsed!.digits)).toBe(110);
  });
});

describe('streaks', () => {
  const day = (date: string) => ({ date, day: dayNumber(date), score: 0, rounds: [] });

  it('grows on consecutive days and resets after a gap', () => {
    let p = recordDaily(emptyProfile(), day('2026-09-13'));
    p = recordDaily(p, day('2026-09-14'));
    expect(p.streak).toBe(2);
    expect(liveStreak(p, '2026-09-15')).toBe(2);
    expect(liveStreak(p, '2026-09-16')).toBe(0);
    p = recordDaily(p, day('2026-09-17'));
    expect(p.streak).toBe(1);
    expect(p.bestStreak).toBe(2);
  });

  it('tallies tiers and best score across daily and unlimited games', () => {
    const rounds: RoundResult[] = [
      { promptId: 'a', input: 'x', answer: 'x', tier: 'rare', points: 60 },
      { promptId: 'b', input: '', answer: null, tier: null, points: 0 },
    ];
    let p = recordDaily(emptyProfile(), { ...day('2026-09-13'), score: 60, rounds });
    p = recordUnlimited(p, rounds, 60);
    expect(p.tierCounts).toEqual([2, 0, 0, 0, 2, 0, 0]);
    expect(p.bestScore).toBe(60);
    expect(p.unlimitedPlayed).toBe(1);
  });
});
