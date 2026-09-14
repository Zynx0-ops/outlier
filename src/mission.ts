import { altitudeKm, formatAltitude, landmarkAt } from './altitude';
import { total, type Game } from './game';
import { icon, TIER_ICON } from './icons';
import { AnswerIndex } from './match';
import { Scene, type SceneMode } from './scene';
import { ROUND_SECONDS } from './schedule';
import { tierById, tierIndex, type Answer, type Prompt, type RoundResult } from './types';
import { confirmAlert, esc, mount, nav, onUnmount, tierTile } from './ui';

type EndReason = 'answer' | 'skip' | 'timeout';

function higherAnswers(prompt: Prompt, round: RoundResult): Answer[] {
  const floor = Math.max(round.tier ? tierIndex(round.tier) : -1, 1);
  return prompt.answers
    .filter((a) => a.tier !== 'outlier' && tierIndex(a.tier) > floor)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

export function play(game: Game): void {
  const scene = new Scene();
  let skip = (): void => {};
  let next = (): void => {};
  let stopTimer = (): void => {};

  const root = mount(
    `<div class="mission" data-mode="ask">
      <header class="mission-nav">
        <button class="btn icon-btn" data-act="quit" aria-label="End mission">${icon('xmark')}</button>
        <div class="progress">${game.prompts.map(() => '<i></i>').join('')}</div>
        <span class="round-num" aria-label="Seconds left">${ROUND_SECONDS}</span>
      </header>
      <div class="hud"><div class="hud-alt"></div><div class="hud-where"></div><div class="hud-gain"></div></div>
      <section class="panel ask"></section>
      <section class="panel result" aria-live="polite"></section>
    </div>`,
    {
      quit: () =>
        void confirmAlert({
          title: 'Abort mission?',
          message: 'Your answers so far won’t be saved.',
          confirm: 'Abort',
        }).then((ok) => ok && nav.home()),
      skip: () => skip(),
      next: () => next(),
    },
  );

  const mission = root.querySelector<HTMLDivElement>('.mission')!;
  mission.prepend(scene.el);
  const q = (sel: string): HTMLElement => mission.querySelector<HTMLElement>(sel)!;
  const altEl = q('.hud-alt');
  const whereEl = q('.hud-where');
  const gainEl = q('.hud-gain');
  const askEl = q('.ask');
  const resultEl = q('.result');
  const secondsEl = q('.round-num');
  const pips = [...mission.querySelectorAll<HTMLElement>('.progress i')];

  const setMode = (mode: SceneMode) => {
    mission.dataset.mode = mode;
    scene.setMode(mode);
  };

  scene.onFrame = (score) => {
    const km = altitudeKm(score);
    altEl.textContent = formatAltitude(km);
    whereEl.textContent = landmarkAt(km).label;
  };
  scene.jump(total(game.rounds));

  const paintProgress = () =>
    pips.forEach((pip, i) => {
      const r = game.rounds[i];
      pip.className = r ? `tier-${r.tier ?? 'miss'}` : i === game.rounds.length ? 'now' : '';
    });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && mission.dataset.mode === 'result') {
      e.preventDefault();
      next();
    } else if (e.key === ' ' && mission.dataset.mode === 'flight') {
      e.preventDefault();
      scene.skip();
    }
  };
  document.addEventListener('keydown', onKey);
  onUnmount(() => {
    document.removeEventListener('keydown', onKey);
    stopTimer();
    scene.destroy();
  });

  function ask(): void {
    const prompt = game.prompts[game.rounds.length];
    const index = new AnswerIndex(prompt);
    const tried: string[] = [];
    let done = false;

    paintProgress();
    setMode('ask');
    resultEl.classList.remove('show');
    gainEl.classList.remove('show');
    askEl.innerHTML = `
      <div class="ask-meta"><span>${esc(prompt.cat)}</span><span>${game.rounds.length + 1}/${game.prompts.length}</span></div>
      <h2 class="ask-title">${esc(prompt.text)}</h2>
      ${prompt.hint ? `<p class="ask-hint">${esc(prompt.hint)}</p>` : ''}
      <div class="timer-bar" aria-hidden="true">${'<i></i>'.repeat(ROUND_SECONDS)}</div>
      <form class="field" autocomplete="off">
        <input name="guess" aria-label="Your answer" placeholder="Type an answer_" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" maxlength="60" />
        <button class="btn btn-filled send" type="submit" aria-label="Lock in answer" disabled>${icon('arrow-up')}</button>
      </form>
      <p class="ask-error" hidden>${icon('xmark')}<span></span></p>
      <div class="tried"></div>
      <div class="ask-foot"><button class="text-btn" data-act="skip">Skip ${icon('forward')}</button></div>`;
    askEl.classList.add('show');

    const form = askEl.querySelector('form')!;
    const input = form.querySelector('input')!;
    const send = form.querySelector('button')!;
    const error = askEl.querySelector<HTMLParagraphElement>('.ask-error')!;
    const triedEl = askEl.querySelector<HTMLDivElement>('.tried')!;
    const timerBar = askEl.querySelector<HTMLDivElement>('.timer-bar')!;
    const cells = [...timerBar.children] as HTMLElement[];
    input.focus({ preventScroll: true });

    const finish = (text: string, answer: Answer | null, reason: EndReason) => {
      if (done) return;
      done = true;
      stopTimer();
      skip = () => {};
      const tier = answer?.tier ?? null;
      game.rounds.push({
        promptId: prompt.id,
        input: text,
        answer: answer?.display ?? null,
        tier,
        points: tier ? tierById(tier).points : 0,
      });
      input.blur();
      void launch(prompt, reason);
    };
    skip = () => finish('', null, 'skip');

    input.addEventListener('input', () => {
      send.disabled = !input.value.trim();
    });
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
      if (hit) return finish(guess, hit, 'answer');

      input.value = '';
      send.disabled = true;
      if (!tried.some((t) => t.toLowerCase() === guess.toLowerCase())) tried.push(guess);
      error.hidden = false;
      error.querySelector('span')!.textContent = `“${guess}” isn’t on the list. Try again!`;
      triedEl.innerHTML = tried.map((t) => `<span>${esc(t)}</span>`).join('');
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      navigator.vibrate?.(30);
    });

    const started = performance.now();
    let frame = 0;
    let shown = -1;
    const tick = (now: number) => {
      const left = Math.max(0, 1 - (now - started) / (ROUND_SECONDS * 1000));
      const seconds = Math.ceil(left * ROUND_SECONDS);
      if (seconds !== shown) {
        shown = seconds;
        secondsEl.textContent = String(seconds);
        cells.forEach((cell, i) => cell.classList.toggle('off', i >= seconds));
        timerBar.classList.toggle('urgent', seconds <= 5);
      }
      if (left > 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      // Grace: a valid answer still sitting in the box counts.
      const pending = input.value.trim();
      const hit = pending ? index.match(pending) : null;
      finish(hit ? pending : (tried.at(-1) ?? ''), hit, 'timeout');
    };
    frame = requestAnimationFrame(tick);
    stopTimer = () => cancelAnimationFrame(frame);
  }

  async function launch(prompt: Prompt, reason: EndReason): Promise<void> {
    const round = game.rounds[game.rounds.length - 1];
    const tier = round.tier ? tierById(round.tier) : null;
    paintProgress();
    askEl.classList.remove('show');
    setMode('flight');

    gainEl.className = `hud-gain show tier-${round.tier ?? 'miss'}`;
    gainEl.innerHTML = tier
      ? `${icon(TIER_ICON[tier.id])}<span>+${tier.points} ${tier.name}</span>`
      : `${icon('xmark')}<span>Engine stall</span>`;

    if (tier) await scene.fly(total(game.rounds));
    else await scene.stall();
    if (scene.destroyed) return;
    if (round.tier === 'outlier') scene.celebrate();
    showResult(prompt, round, reason);
  }

  function showResult(prompt: Prompt, round: RoundResult, reason: EndReason): void {
    const last = game.rounds.length === game.prompts.length;
    const tier = round.tier ? tierById(round.tier) : null;
    const higher = higherAnswers(prompt, round);

    const title = tier ? tier.name : reason === 'skip' ? 'Skipped' : round.input ? 'Not on the list' : 'Time up';
    const answer = round.answer ?? (round.input ? `“${round.input}”` : 'No answer');
    const outlierLine =
      round.tier === 'outlier'
        ? `<div class="result-line">${icon('star')}<span>You found the Outlier!</span></div>`
        : `<div class="result-line">${icon('star')}<span>Outlier</span><b>${esc(prompt.outlier.display)}</b></div>`;

    resultEl.className = `panel result tier-${round.tier ?? 'miss'}`;
    resultEl.innerHTML = `
      <div class="result-head">
        ${tierTile(round.tier, 'lg')}
        <div class="result-text">
          <div class="result-tier">${title}</div>
          <div class="result-answer">${esc(answer)}</div>
        </div>
        <div class="result-pts">+${round.points}</div>
      </div>
      <p class="result-blurb">${tier ? tier.blurb : 'No thrust this round. Your rocket held its altitude.'}</p>
      ${outlierLine}
      ${
        higher.length
          ? `<div class="higher-label">Could’ve flown higher</div><div class="chips">${higher
              .map((a) => `<span class="chip tier-${a.tier}">${esc(a.display)}</span>`)
              .join('')}</div>`
          : ''
      }
      <button class="btn btn-filled btn-large" data-act="next">${last ? 'Mission report' : 'Next prompt'}</button>`;

    setMode('result');
    resultEl.classList.add('show');
    resultEl.querySelector<HTMLButtonElement>('[data-act="next"]')!.focus({ preventScroll: true });

    const shownAt = performance.now();
    next = () => {
      if (performance.now() - shownAt < 350) return;
      next = () => {};
      if (last) nav.report(game);
      else ask();
    };
  }

  ask();
}
