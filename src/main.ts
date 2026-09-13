import './style.css';
import { altitudeKm, formatAltitude, landmarkAt, MAX_SCORE, MOON_KM } from './altitude';
import { PROMPT_IDS, promptById } from './data';
import { AnswerIndex } from './match';
import { dailyIds, dateKey, dayNumber, randomSeed, seededIds } from './schedule';
import {
  challengeHash,
  copyText,
  emojiRow,
  parseChallenge,
  scoreFromDigits,
  shareText,
  tierDigits,
  type Challenge,
} from './share';
import { liveStreak, loadProfile, recordDaily, recordUnlimited, saveProfile } from './storage';
import { MISS_EMOJI, TIERS, tierById, tierIndex, type Answer, type Prompt, type RoundResult } from './types';

const ROUND_SECONDS = 20;

interface Game {
  mode: 'daily' | 'unlimited';
  label: string;
  date: string;
  seed: string;
  prompts: Prompt[];
  rounds: RoundResult[];
  challenge: Challenge | null;
  saved: boolean;
}

const app = document.querySelector<HTMLDivElement>('#app')!;
let profile = loadProfile();
let game: Game | null = null;
let cancelTimer: (() => void) | null = null;
let actions: Record<string, () => void> = {};

// ---------- helpers ----------

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const total = (rounds: RoundResult[]): number => rounds.reduce((sum, r) => sum + r.points, 0);

const pageUrl = (): string => location.origin + location.pathname;

const tierClass = (r: RoundResult | undefined): string => (r ? `tier-${r.tier ?? 'miss'}` : '');

function setLift(score: number): void {
  document.documentElement.style.setProperty('--lift', String(score / MAX_SCORE));
}

function stopTimer(): void {
  cancelTimer?.();
  cancelTimer = null;
}

function mount(html: string, handlers: Record<string, () => void>): void {
  stopTimer();
  actions = handlers;
  app.innerHTML = html + gauge();
  window.scrollTo({ top: 0 });
}

app.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
  if (el) actions[el.dataset.act!]?.();
});

function makeStars(): void {
  const sky = document.getElementById('stars')!;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 140; i++) {
    const s = document.createElement('span');
    const size = Math.random() < 0.85 ? 1.5 : 2.5;
    s.className = 'star';
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;--d:${2 + Math.random() * 4}s;animation-delay:-${Math.random() * 6}s`;
    frag.append(s);
  }
  sky.append(frag);
}

function gauge(): string {
  const at = (km: number) => (Math.log(km + 1) / Math.log(MOON_KM + 1)) * 100;
  const marks: [number, string][] = [
    [8.85, 'Everest'],
    [100, 'Space'],
    [408, 'ISS'],
    [20_200, 'GPS'],
    [MOON_KM, 'Moon'],
  ];
  return `<div class="gauge" aria-hidden="true">
    ${marks.map(([km, label]) => `<span class="mark" style="bottom:${at(km)}%">${label}</span>`).join('')}
    <span class="ship">🚀</span>
  </div>`;
}

// ---------- home ----------

function home(): void {
  game = null;
  setLift(0);
  const today = dateKey();
  const day = dayNumber(today);
  const done = profile.daily[today];
  const challenge = parseChallenge(location.hash);

  let banner = '';
  if (challenge) {
    const theirs = challenge.digits.length
      ? `They launched to <b>${formatAltitude(altitudeKm(scoreFromDigits(challenge.digits)))}</b>. Can you fly higher on the same seven prompts?<br/><span class="nowrap">${emojiRow(challenge.digits)}</span>`
      : 'Someone sent you a mission. Same seven prompts, see who launches higher.';
    banner = `<div class="card challenge-banner">
      <div class="kicker">Incoming challenge</div>
      <p>${theirs}</p>
      <div class="actions"><button class="btn primary" data-act="accept">Accept challenge</button></div>
    </div>`;
  }

  const streak = liveStreak(profile, today);
  mount(
    `<main class="screen home">
      <div class="rocket" aria-hidden="true">🚀</div>
      <div class="kicker">rare-answer trivia</div>
      <h1>Outlier</h1>
      <p class="tagline">7 prompts · ${ROUND_SECONDS} seconds each · the rarer your answer, the higher you launch</p>
      ${banner}
      <div class="actions">
        <button class="btn ${challenge ? '' : 'primary'}" data-act="daily">${done ? `Mission #${day} results` : `Launch mission #${day}`}</button>
        <button class="btn" data-act="unlimited">Unlimited ∞</button>
      </div>
      <div class="stats">
        <div class="stat"><b>${streak}</b><span>Streak</span></div>
        <div class="stat"><b>${profile.bestStreak}</b><span>Best streak</span></div>
        <div class="stat"><b>${Object.keys(profile.daily).length + profile.unlimitedPlayed}</b><span>Missions</span></div>
      </div>
      <div><button class="link" data-act="how">How to play</button></div>
    </main>`,
    {
      daily: startDaily,
      unlimited: () => startUnlimited(randomSeed(), null),
      accept: () => {
        history.replaceState(null, '', pageUrl());
        startUnlimited(challenge!.seed, challenge!.digits.length ? challenge : null);
      },
      how: howToPlay,
    },
  );

  if (!profile.seenIntro) {
    profile = { ...profile, seenIntro: true };
    saveProfile(profile);
    howToPlay();
  }
}

function howToPlay(): void {
  document.querySelector('dialog')?.remove();
  const dialog = document.createElement('dialog');
  dialog.innerHTML = `
    <h2>How to play</h2>
    <p>You get <b>7 prompts</b> and <b>${ROUND_SECONDS} seconds</b> each. Type any answer that fits. Wrong or unknown answers don’t end the round, so keep guessing until the clock runs out.</p>
    <p>Obvious answers barely get you off the ground. <b>Rare answers launch you higher.</b> Score 700 and you land on the Moon.</p>
    <table class="tier-table">
      ${[...TIERS].reverse().map((t) => `<tr class="tier-${t.id}"><td>${t.emoji} ${t.name}</td><td>${t.blurb}</td><td>${t.points}</td></tr>`).join('')}
    </table>
    <p>Everyone gets the same daily mission. Unlimited missions are random, and you can send any of them to a friend as a challenge.</p>
    <form method="dialog"><button class="btn primary" style="width:100%">Got it</button></form>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
}

// ---------- game setup ----------

const loadPrompts = (ids: string[]): Prompt[] => ids.map((id) => promptById(id)).filter((p): p is Prompt => !!p);

function startDaily(): void {
  const date = dateKey();
  const day = dayNumber(date);
  const record = profile.daily[date];
  game = {
    mode: 'daily',
    label: `#${day}`,
    date,
    seed: date,
    prompts: loadPrompts(record ? record.rounds.map((r) => r.promptId) : dailyIds(date, PROMPT_IDS)),
    rounds: record ? record.rounds : [],
    challenge: null,
    saved: !!record,
  };
  if (record) results();
  else playRound();
}

function startUnlimited(seed: string, challenge: Challenge | null): void {
  game = {
    mode: 'unlimited',
    label: `∞ ${seed}`,
    date: dateKey(),
    seed,
    prompts: loadPrompts(seededIds(seed, PROMPT_IDS)),
    rounds: [],
    challenge,
    saved: false,
  };
  playRound();
}

// ---------- play ----------

function hud(g: Game): string {
  const score = total(g.rounds);
  const pips = g.prompts
    .map((_, i) => `<span class="pip ${i === g.rounds.length ? 'now' : tierClass(g.rounds[i])}"></span>`)
    .join('');
  return `<div class="hud">
    <span>Mission ${esc(g.label)}</span>
    <span class="pips">${pips}</span>
    <span><b>${formatAltitude(altitudeKm(score))}</b> · ${score} pts</span>
  </div>`;
}

function playRound(): void {
  const g = game!;
  const prompt = g.prompts[g.rounds.length];
  const index = new AnswerIndex(prompt);
  setLift(total(g.rounds));

  const tried: string[] = [];
  let finished = false;

  const finish = (input: string, answer: Answer | null) => {
    if (finished) return;
    finished = true;
    stopTimer();
    const tier = answer?.tier ?? null;
    g.rounds.push({
      promptId: prompt.id,
      input,
      answer: answer?.display ?? null,
      tier,
      points: tier ? tierById(tier).points : 0,
    });
    reveal(prompt);
  };

  mount(
    `<main class="screen">
      ${hud(g)}
      <section class="card prompt-card">
        <div class="cat">${esc(prompt.cat)} · ${g.rounds.length + 1} of ${g.prompts.length}</div>
        <h2>${esc(prompt.text)}</h2>
        ${prompt.hint ? `<p class="hint">${esc(prompt.hint)}</p>` : ''}
        <form class="answer-form" autocomplete="off">
          <input name="guess" aria-label="Your answer" placeholder="Type an answer…" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" maxlength="60" />
          <button class="btn primary" type="submit">Lock in</button>
        </form>
        <div class="timer" role="progressbar" aria-label="Time left"><div class="timer-fill"></div></div>
        <p class="feedback" aria-live="polite"></p>
        <div class="tried"></div>
        <div class="play-foot">
          <span class="keys">enter to lock in</span>
          <button class="link" data-act="skip">Skip</button>
        </div>
      </section>
    </main>`,
    { skip: () => finish('', null) },
  );

  const form = app.querySelector<HTMLFormElement>('.answer-form')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const feedback = app.querySelector<HTMLParagraphElement>('.feedback')!;
  const triedBox = app.querySelector<HTMLDivElement>('.tried')!;
  const timer = app.querySelector<HTMLDivElement>('.timer')!;
  const fill = timer.querySelector<HTMLDivElement>('.timer-fill')!;
  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing) return;
    e.preventDefault();
    form.requestSubmit();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const guess = input.value.trim();
    if (!guess) return;
    const hit = index.match(guess);
    if (hit) return finish(guess, hit);

    input.value = '';
    if (!tried.some((t) => t.toLowerCase() === guess.toLowerCase())) tried.push(guess);
    feedback.textContent = `“${guess}” isn’t on our list. Keep going!`;
    triedBox.innerHTML = tried.map((t) => `<span>${esc(t)}</span>`).join('');
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  });

  const started = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const left = Math.max(0, 1 - (now - started) / (ROUND_SECONDS * 1000));
    fill.style.transform = `scaleX(${left})`;
    timer.classList.toggle('urgent', left < 0.25);
    if (left > 0) {
      frame = requestAnimationFrame(tick);
      return;
    }
    // Grace: an unsubmitted answer in the box still counts if it's valid.
    const pending = input.value.trim();
    const hit = pending ? index.match(pending) : null;
    finish(hit ? pending : (tried.at(-1) ?? ''), hit);
  };
  frame = requestAnimationFrame(tick);
  cancelTimer = () => cancelAnimationFrame(frame);
}

function higherAnswers(prompt: Prompt, round: RoundResult): Answer[] {
  const floor = round.tier ? tierIndex(round.tier) : -1;
  const pool = prompt.answers.filter((a) => tierIndex(a.tier) > floor && a.tier !== 'outlier' && tierIndex(a.tier) >= 2);
  return pool.sort(() => Math.random() - 0.5).slice(0, 3);
}

function reveal(prompt: Prompt): void {
  const g = game!;
  const round = g.rounds.at(-1)!;
  const last = g.rounds.length === g.prompts.length;
  const tier = round.tier ? tierById(round.tier) : null;
  const shownAt = performance.now();

  const headline = tier
    ? `<div class="badge">${tier.emoji} ${tier.name}</div>
       <h2>${esc(round.answer!)}</h2>
       <p class="points">+${tier.points}</p>
       <p class="blurb">${tier.blurb}</p>`
    : `<div class="badge">${MISS_EMOJI} ${round.input ? 'Not on the list' : 'No answer'}</div>
       <h2>Engine stall</h2>
       <p class="points">+0</p>`;

  const higher = higherAnswers(prompt, round);
  const next = () => {
    if (performance.now() - shownAt < 350) return;
    if (last) results();
    else playRound();
  };

  mount(
    `<main class="screen">
      ${hud(g)}
      <section class="card reveal ${tierClass(round)}">
        <div class="cat">${esc(prompt.text)}</div>
        ${headline}
        ${round.tier !== 'outlier' ? `<p class="gem">🌟 The Outlier was <b>${esc(prompt.outlier.display)}</b></p>` : ''}
        ${higher.length ? `<p class="could">Could’ve flown higher with ${higher.map((a) => `<span class="chip tier-${a.tier}">${esc(a.display)}</span>`).join(' ')}</p>` : ''}
        <button class="btn primary" data-act="next">${last ? 'Mission report' : 'Next prompt'} ↵</button>
      </section>
    </main>`,
    { next },
  );
  setLift(total(g.rounds));
  app.querySelector<HTMLButtonElement>('[data-act="next"]')!.focus();
}

// ---------- results ----------

function results(): void {
  const g = game!;
  const score = total(g.rounds);
  const km = altitudeKm(score);
  const digits = tierDigits(g.rounds);

  if (!g.saved) {
    g.saved = true;
    profile =
      g.mode === 'daily'
        ? recordDaily(profile, { date: g.date, day: dayNumber(g.date), score, rounds: g.rounds })
        : recordUnlimited(profile, score);
    saveProfile(profile);
  }

  const challengeUrl = pageUrl() + challengeHash(g.seed, g.rounds);
  const shareUrl = g.mode === 'daily' ? pageUrl() : challengeUrl;

  let versus = '';
  if (g.challenge) {
    const theirs = scoreFromDigits(g.challenge.digits);
    const verdict =
      score > theirs ? `You out-flew your friend by ${score - theirs} pts 🏆` : score < theirs ? `Your friend wins by ${theirs - score} pts` : 'Dead heat!';
    versus = `<p class="versus">Them: ${emojiRow(g.challenge.digits)} ${theirs} pts<br/>${verdict}</p>`;
  }

  const rounds = g.rounds
    .map((round, i) => {
      const prompt = g.prompts[i];
      const tier = round.tier ? tierById(round.tier) : null;
      const lists = [...TIERS]
        .reverse()
        .map((t) => {
          const names = prompt.answers
            .filter((a) => a.tier === t.id)
            .map((a) => (a.display === round.answer ? `<mark>${esc(a.display)}</mark>` : esc(a.display)));
          return names.length ? `<div class="tier-${t.id}"><h4>${t.emoji} ${t.name} · ${t.points}</h4><p>${names.join(', ')}</p></div>` : '';
        })
        .join('');
      return `<details class="card round ${tierClass(round)}">
        <summary>
          <span class="num">${i + 1}</span>
          <span class="q">${esc(prompt.text)}</span>
          <span class="you">${round.answer ? esc(round.answer) : '—'}</span>
          <span class="chip ${tierClass(round)}">${tier ? `${tier.emoji} +${tier.points}` : `${MISS_EMOJI} 0`}</span>
        </summary>
        <div class="all-answers">${lists}</div>
      </details>`;
    })
    .join('');

  mount(
    `<main class="screen">
      <section class="card summary">
        <div class="kicker">Mission ${esc(g.label)} report</div>
        <div class="big-alt">${formatAltitude(km)}</div>
        <div class="landmark">${landmarkAt(km).label}</div>
        <div class="score-line">${score} / ${MAX_SCORE} pts</div>
        <div class="emoji-row">${emojiRow(digits)}</div>
        ${versus}
        <div class="actions">
          <button class="btn primary" data-act="share">Copy result</button>
          ${g.mode === 'unlimited' ? '<button class="btn" data-act="challenge">Copy challenge link</button>' : ''}
        </div>
        <p class="toast" aria-live="polite"></p>
      </section>
      <div class="rounds">${rounds}</div>
      <div class="actions">
        <button class="btn" data-act="again">Another unlimited mission</button>
        <button class="btn" data-act="home">Home</button>
      </div>
    </main>`,
    {
      share: () => void copy(shareText(g.label, g.rounds, shareUrl), 'Result copied — paste it anywhere.'),
      challenge: () => void copy(challengeUrl, 'Challenge link copied. Send it to a friend!'),
      again: () => startUnlimited(randomSeed(), null),
      home,
    },
  );
  setLift(score);
}

async function copy(text: string, message: string): Promise<void> {
  const ok = await copyText(text);
  const toast = app.querySelector('.toast');
  if (toast) toast.textContent = ok ? message : 'Couldn’t copy. Try again?';
}

makeStars();
home();
