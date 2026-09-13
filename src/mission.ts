import { altitudeKm, formatAltitude, landmarkAt } from './altitude';
import { total, type Game } from './game';
import { icon, TIER_ICON } from './icons';
import { AnswerIndex } from './match';
import { Scene, type SceneMode } from './scene';
import { ROUND_SECONDS } from './schedule';
import { tierById, tierIndex, type Answer, type Prompt, type RoundResult } from './types';
import { confirmAlert, esc, mount, nav, onUnmount, tierTile } from './ui';

type EndReason = 'answer' | 'skip' | 'timeout';

const RING = 2 * Math.PI * 16;

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
        <button class="glass-btn" data-act="quit" aria-label="End mission">${icon('xmark')}</button>
        <div class="progress">${game.prompts.map(() => '<i></i>').join('')}</div>
        <div class="ring">
          <svg viewBox="0 0 36 36" aria-hidden="true"><circle class="ring-track" cx="18" cy="18" r="16"/><circle class="ring-fill" cx="18" cy="18" r="16" stroke-dasharray="${RING}"/></svg>
          <span class="ring-num" aria-label="Seconds left">${ROUND_SECONDS}</span>
        </div>
      </header>
      <div class="hud"><div class="hud-alt"></div><div class="hud-where"></div><div class="hud-gain"></div></div>
      <section class="ask material"></section>
      <section class="sheet material" aria-live="polite"></section>
    </div>`,
    {
      quit: () =>
        void confirmAlert({
          title: 'End this mission?',
          message: 'Your answers so far won’t be saved.',
          confirm: 'End Mission',
        }).then((ok) => ok && nav.home()),
      skip: () => skip(),
      next: () => next(),
    },
  );

  const mission = root.querySelector<HTMLDivElement>('.mission')!;
  mission.prepend(scene.el);
  const q = <T extends Element = HTMLElement>(sel: string): T => mission.querySelector<T>(sel)!;
  const altEl = q('.hud-alt');
  const whereEl = q('.hud-where');
  const gainEl = q('.hud-gain');
  const askEl = q('.ask');
  const sheetEl = q('.sheet');
  const ringEl = q('.ring');
  const ringFill = q<SVGCircleElement>('.ring-fill');
  const ringNum = q('.ring-num');
  const pips = [...mission.querySelectorAll<HTMLElement>('.progress i')];

  const setMode = (mode: SceneMode) => {
    mission.dataset.mode = mode;
    scene.setMode(mode);
  };

  scene.onFrame = (score) => {
    const km = altitudeKm(score);
    altEl.textContent = formatAltitude(km);
    const where = landmarkAt(km).label;
    if (whereEl.textContent !== where) {
      whereEl.textContent = where;
      whereEl.classList.remove('pulse');
      void whereEl.offsetWidth;
      whereEl.classList.add('pulse');
    }
  };
  scene.jump(total(game.rounds));

  const paintProgress = () =>
    pips.forEach((pip, i) => {
      const r = game.rounds[i];
      pip.className = r ? `tier-${r.tier ?? 'miss'}` : i === game.rounds.length ? 'now' : '';
    });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && mission.dataset.mode === 'sheet') {
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
    sheetEl.classList.remove('open');
    gainEl.classList.remove('show');
    askEl.innerHTML = `
      <div class="ask-meta"><span>${esc(prompt.cat)}</span><span>${game.rounds.length + 1} of ${game.prompts.length}</span></div>
      <h2 class="ask-title">${esc(prompt.text)}</h2>
      ${prompt.hint ? `<p class="ask-hint">${esc(prompt.hint)}</p>` : ''}
      <form class="field" autocomplete="off">
        <input name="guess" aria-label="Your answer" placeholder="Your answer" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" maxlength="60" />
        <button class="send" type="submit" aria-label="Lock in answer" disabled>${icon('arrow-up')}</button>
      </form>
      <p class="ask-error" hidden>${icon('xmark-circle')}<span></span></p>
      <div class="tried"></div>
      <div class="ask-foot"><button class="text-btn" data-act="skip">Skip ${icon('forward')}</button></div>`;
    askEl.classList.remove('gone');

    const form = askEl.querySelector('form')!;
    const input = form.querySelector('input')!;
    const send = form.querySelector('button')!;
    const error = askEl.querySelector<HTMLParagraphElement>('.ask-error')!;
    const triedEl = askEl.querySelector<HTMLDivElement>('.tried')!;
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
      error.querySelector('span')!.textContent = `“${guess}” isn’t on the list. Keep going!`;
      triedEl.innerHTML = tried.map((t) => `<span>${esc(t)}</span>`).join('');
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      navigator.vibrate?.(30);
    });

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const left = Math.max(0, 1 - (now - started) / (ROUND_SECONDS * 1000));
      ringFill.style.strokeDashoffset = String(RING * (1 - left));
      ringNum.textContent = String(Math.ceil(left * ROUND_SECONDS));
      ringEl.classList.toggle('urgent', left <= 5 / ROUND_SECONDS);
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
    askEl.classList.add('gone');
    setMode('flight');

    gainEl.className = `hud-gain tier-${round.tier ?? 'miss'}`;
    gainEl.innerHTML = tier
      ? `${icon(TIER_ICON[tier.id])}<span>+${tier.points} · ${tier.name}</span>`
      : `${icon('xmark')}<span>Engine stall</span>`;
    requestAnimationFrame(() => gainEl.classList.add('show'));

    if (tier) await scene.fly(total(game.rounds));
    else await scene.stall();
    if (scene.destroyed) return;
    if (round.tier === 'outlier') scene.celebrate();
    showSheet(prompt, round, reason);
  }

  function showSheet(prompt: Prompt, round: RoundResult, reason: EndReason): void {
    const last = game.rounds.length === game.prompts.length;
    const tier = round.tier ? tierById(round.tier) : null;
    const higher = higherAnswers(prompt, round);

    const title = tier ? tier.name : reason === 'skip' ? 'Skipped' : round.input ? 'Not on the list' : 'Out of time';
    const answer = round.answer ?? (round.input ? `“${round.input}”` : 'No answer');
    const outlierRow =
      round.tier === 'outlier'
        ? `<div class="inset-row">${icon('star', 'star')}<span>You found the Outlier!</span></div>`
        : `<div class="inset-row">${icon('star', 'star')}<span>The Outlier</span><b>${esc(prompt.outlier.display)}</b></div>`;

    sheetEl.className = `sheet material tier-${round.tier ?? 'miss'}`;
    sheetEl.innerHTML = `
      <div class="grabber"></div>
      <div class="result">
        ${tierTile(round.tier, 'lg')}
        <div class="result-text">
          <div class="result-tier">${title}</div>
          <div class="result-answer">${esc(answer)}</div>
        </div>
        <div class="result-pts">+${round.points}</div>
      </div>
      <p class="result-blurb">${tier ? tier.blurb : 'No thrust this round. Your rocket held its altitude.'}</p>
      <div class="inset-list">${outlierRow}</div>
      ${
        higher.length
          ? `<div class="higher"><div class="higher-label">Could’ve flown higher</div><div class="chips">${higher
              .map((a) => `<span class="chip tier-${a.tier}">${esc(a.display)}</span>`)
              .join('')}</div></div>`
          : ''
      }
      <button class="btn btn-filled btn-large" data-act="next">${last ? 'View Mission Report' : 'Next Prompt'}</button>`;

    setMode('sheet');
    requestAnimationFrame(() => sheetEl.classList.add('open'));
    sheetEl.querySelector<HTMLButtonElement>('[data-act="next"]')!.focus({ preventScroll: true });

    const shownAt = performance.now();
    next = () => {
      if (performance.now() - shownAt < 400) return;
      next = () => {};
      if (last) nav.report(game);
      else ask();
    };
  }

  ask();
}
