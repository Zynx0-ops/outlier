import { altitudeKm, formatAltitude, landmarkAt, MAX_SCORE } from './altitude';
import { dailyGame, saveGame, total, unlimitedGame, type Game } from './game';
import { icon, type IconName } from './icons';
import { shipSvg, skyColors } from './scene';
import { dateKey, dayNumber, randomSeed, ROUND_SECONDS, ROUNDS } from './schedule';
import { challengeHash, copyText, parseChallenge, scoreFromDigits, shareText } from './share';
import { setProfile, state } from './state';
import { liveStreak } from './storage';
import { TIERS, tierById, type TierId } from './types';
import { dots, esc, iconTile, mount, nav, onUnmount, pageUrl, tierTile, toast, type Tab } from './ui';

const APP_ICON = `<svg viewBox="0 0 512 512" aria-hidden="true">
  <defs><linearGradient id="appicon-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1640"/><stop offset=".55" stop-color="#2C6BD0"/><stop offset="1" stop-color="#86BDF2"/></linearGradient></defs>
  <rect width="512" height="512" fill="url(#appicon-bg)"/>
  <circle cx="392" cy="112" r="46" fill="#F2F2F7"/>
  <g fill="#fff"><circle cx="96" cy="92" r="5"/><circle cx="170" cy="164" r="3.5"/><circle cx="286" cy="70" r="4"/><circle cx="84" cy="250" r="3"/></g>
  <g transform="translate(262 300) rotate(35) scale(2.7) translate(-28 -53)">${shipSvg('appicon').replace(/<\/?svg[^>]*>/g, '')}</g>
</svg>`;

const skyStyle = (score: number): string => {
  const [top, horizon] = skyColors(score / MAX_SCORE);
  return `background:linear-gradient(165deg, ${top}, ${horizon})`;
};

const digitTiers = (digits: number[]): (TierId | null)[] => digits.map((d) => (d > 0 ? TIERS[d - 1].id : null));

const shortDate = (key: string): string =>
  new Date(`${key}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ---------- app shell ----------

function tabBar(active: Tab): string {
  const tabs: [Tab, IconName, string][] = [
    ['play', 'rocket', 'Play'],
    ['stats', 'chart', 'Stats'],
    ['help', 'question', 'How to Play'],
  ];
  return `<nav class="tabbar">${tabs
    .map(
      ([id, name, label]) =>
        `<button class="tab ${id === active ? 'active' : ''}" data-act="tab" data-tab="${id}" ${id === active ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span></button>`,
    )
    .join('')}</nav>`;
}

const shell = (tab: Tab, eyebrow: string, title: string, body: string): string => `
  <div class="app">
    <header class="large-title"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></header>
    <main>${body}</main>
  </div>
  ${tabBar(tab)}`;

const tabHandler = { tab: (el: HTMLElement) => showTab(el.dataset.tab as Tab) };

export function showTab(tab: Tab = 'play'): void {
  if (tab === 'stats') stats();
  else if (tab === 'help') help();
  else home();
}

// ---------- play ----------

function home(): void {
  const today = dateKey();
  const day = dayNumber(today);
  const record = state.profile.daily[today];
  const challenge = parseChallenge(location.hash);
  const profile = state.profile;
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  let hero: string;
  if (record) {
    const km = altitudeKm(record.score);
    hero = `<section class="hero ${record.score / MAX_SCORE > 0.3 ? 'starry' : ''}" style="${skyStyle(record.score)}">
      <div class="hero-moon"></div>
      <div class="hero-eyebrow">Mission #${day} · Complete</div>
      <div class="hero-alt">${formatAltitude(km)}</div>
      <div class="hero-sub">${esc(landmarkAt(km).label)}</div>
      <div class="hero-foot">
        <button class="btn btn-white" data-act="report">View Report</button>
        <span class="countdown" data-countdown></span>
      </div>
    </section>`;
  } else {
    hero = `<section class="hero" style="${skyStyle(0)}">
      <div class="hero-hill"></div>
      <div class="hero-ship">${shipSvg('hero')}</div>
      <div class="hero-eyebrow">Today’s Mission · #${day}</div>
      <h2 class="hero-title">How high can you fly?</h2>
      <p class="hero-sub">${ROUNDS} prompts, ${ROUND_SECONDS} seconds each. Rare answers launch you higher.</p>
      <div class="hero-foot"><button class="btn btn-white" data-act="daily">${icon('rocket')} Launch</button></div>
    </section>`;
  }

  const challengeCard = challenge
    ? `<section class="group">
        <div class="row">
          ${iconTile('green', 'people')}
          <div class="row-text">
            <div class="row-title">Challenge from a friend</div>
            <div class="row-sub">${
              challenge.digits.length
                ? `They reached ${formatAltitude(altitudeKm(scoreFromDigits(challenge.digits)))}. Beat them on the same ${ROUNDS} prompts.`
                : `Same ${ROUNDS} prompts. See who flies higher.`
            }</div>
          </div>
          <button class="btn btn-tinted btn-small" data-act="accept">Accept</button>
        </div>
      </section>`
    : '';

  const streak = liveStreak(profile, today);
  const body = `
    ${challengeCard}
    ${hero}
    <div class="tiles">
      <div class="tile-card" style="--c:var(--orange)"><div class="tile-head">${icon('flame')} Streak</div><div class="tile-value">${streak}<small> ${streak === 1 ? 'day' : 'days'}</small></div></div>
      <div class="tile-card" style="--c:var(--purple)"><div class="tile-head">${icon('arrow-up')} Best</div><div class="tile-value">${formatAltitude(altitudeKm(profile.bestScore))}</div></div>
    </div>
    <div class="section-header">More ways to play</div>
    <section class="group">
      <button class="row row-button" data-act="unlimited">
        ${iconTile('blue', 'infinity')}
        <div class="row-text"><div class="row-title">Unlimited</div><div class="row-sub">Random missions, as many as you want</div></div>
        ${icon('chevron-right', 'chev')}
      </button>
    </section>`;

  mount(shell('play', dateLabel, 'Outlier', body), {
    ...tabHandler,
    daily: () => nav.play(dailyGame()),
    report: () => nav.report(dailyGame()),
    unlimited: () => nav.play(unlimitedGame(randomSeed())),
    accept: () => {
      history.replaceState(null, '', pageUrl());
      nav.play(unlimitedGame(challenge!.seed, challenge!.digits.length ? challenge : null));
    },
  });

  const countdown = document.querySelector<HTMLElement>('[data-countdown]');
  if (countdown) {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const mins = Math.ceil((midnight.getTime() - now.getTime()) / 60_000);
      countdown.textContent = `Next mission in ${Math.floor(mins / 60)}h ${mins % 60}m`;
    };
    tick();
    const id = setInterval(tick, 30_000);
    onUnmount(() => clearInterval(id));
  }

  if (!profile.seenIntro) {
    setProfile({ ...profile, seenIntro: true });
    welcome();
  }
}

function welcome(): void {
  const features: [string, IconName, string, string][] = [
    ['blue', 'clock', `${ROUNDS} prompts, ${ROUND_SECONDS} seconds`, 'Type any answer that fits. Wrong guesses don’t end the round.'],
    ['purple', 'rocket', 'Rare answers fly higher', 'Obvious picks barely leave the pad. A perfect game lands on the Moon.'],
    ['green', 'people', 'Challenge your friends', 'Send an unlimited mission and see who climbs higher.'],
  ];
  const dialog = document.createElement('dialog');
  dialog.className = 'welcome';
  dialog.innerHTML = `
    <div class="app-icon">${APP_ICON}</div>
    <h2>Welcome to Outlier</h2>
    ${features
      .map(
        ([color, name, title, text]) =>
          `<div class="feature" style="--c:var(--${color})">${icon(name)}<div><b>${title}</b><span>${text}</span></div></div>`,
      )
      .join('')}
    <form method="dialog"><button class="btn btn-filled btn-large">Continue</button></form>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
}

// ---------- stats ----------

function stats(): void {
  const p = state.profile;
  const today = dateKey();
  const records = Object.values(p.daily).sort((a, b) => b.date.localeCompare(a.date));
  const rounds = p.tierCounts.reduce((a, b) => a + b, 0);

  const tile = (color: string, name: IconName, label: string, value: string) =>
    `<div class="tile-card" style="--c:var(--${color})"><div class="tile-head">${icon(name)} ${label}</div><div class="tile-value">${value}</div></div>`;

  const order: [number, TierId | null][] = [...TIERS.map((t, i): [number, TierId | null] => [i + 1, t.id]).reverse(), [0, null]];
  const breakdown = rounds
    ? `<div class="stack">${order
        .filter(([i]) => p.tierCounts[i])
        .map(([i, id]) => `<i class="tier-${id ?? 'miss'}" style="flex:${p.tierCounts[i]}"></i>`)
        .join('')}</div>
      ${order
        .map(([i, id]) => {
          const n = p.tierCounts[i];
          return `<div class="legend-row">${tierTile(id, 'sm')}<span>${id ? tierById(id).name : 'Missed'}</span><b>${n}</b><em>${Math.round((n / rounds) * 100)}%</em></div>`;
        })
        .join('')}`
    : '<p class="empty">Finish a mission to see how rare your answers are.</p>';

  const history = records.length
    ? records
        .map((r) => {
          const km = altitudeKm(r.score);
          return `<button class="row row-button" data-act="past" data-date="${r.date}">
            <div class="row-text"><div class="row-title">Mission #${r.day}</div><div class="row-sub">${shortDate(r.date)}</div></div>
            <div class="row-trail"><span>${formatAltitude(km)}</span>${dots(r.rounds.map((x) => x.tier))}</div>
            ${icon('chevron-right', 'chev')}
          </button>`;
        })
        .join('')
    : '<div class="row"><div class="row-text"><div class="row-sub">No daily missions yet. Today’s is waiting for you.</div></div></div>';

  const body = `
    <div class="tiles">
      ${tile('orange', 'flame', 'Streak', String(liveStreak(p, today)))}
      ${tile('green', 'trophy', 'Best Streak', String(p.bestStreak))}
      ${tile('blue', 'rocket', 'Missions', String(records.length + p.unlimitedPlayed))}
      ${tile('purple', 'arrow-up', 'Best', formatAltitude(altitudeKm(p.bestScore)))}
    </div>
    <div class="section-header">Rarity breakdown</div>
    <section class="group padded">${breakdown}</section>
    <div class="section-header">Daily missions</div>
    <section class="group">${history}</section>`;

  mount(shell('stats', `${rounds} answers`, 'Stats', body), {
    ...tabHandler,
    past: (el) => nav.report(dailyGame(el.dataset.date, 'stats')),
  });
}

// ---------- help ----------

function help(): void {
  const how: [string, IconName, string, string][] = [
    ['blue', 'clock', `${ROUNDS} prompts, ${ROUND_SECONDS} seconds each`, 'Type any answer that fits the prompt before the ring runs out.'],
    ['orange', 'retry', 'Keep guessing', 'An answer that isn’t on the list doesn’t end the round. Just try another.'],
    ['purple', 'rocket', 'Rare answers fly higher', 'Every answer launches your rocket. The rarer it is, the farther it goes.'],
    ['green', 'people', 'Challenge friends', 'Finish an unlimited mission and share the link. They get the same prompts.'],
  ];
  const body = `
    <section class="group">${how
      .map(
        ([color, name, title, text]) =>
          `<div class="row">${iconTile(color, name)}<div class="row-text"><div class="row-title">${title}</div><div class="row-sub">${text}</div></div></div>`,
      )
      .join('')}</section>
    <div class="section-header">Rarity tiers</div>
    <section class="group">${[...TIERS]
      .reverse()
      .map(
        (t) =>
          `<div class="row tier-${t.id}">${tierTile(t.id)}<div class="row-text"><div class="row-title">${t.name}</div><div class="row-sub">${t.blurb}</div></div><span class="pts">${t.points}</span></div>`,
      )
      .join('')}</section>
    <div class="section-header">Altitude</div>
    <section class="group padded"><p class="prose">Your altitude grows exponentially with your score. You’ll pass Everest, the edge of space and the ISS on the way up, and a perfect 700 lands you on the Moon.</p></section>
    <p class="footnote">Inspired by <a href="https://krillion.io" target="_blank" rel="noopener">Krillion</a> · <a href="https://github.com/Zynx0-ops/outlier" target="_blank" rel="noopener">Open source on GitHub</a></p>`;
  mount(shell('help', 'Rare-answer trivia', 'How to Play', body), tabHandler);
}

// ---------- report ----------

async function share(text: string): Promise<void> {
  if (navigator.share && matchMedia('(pointer: coarse)').matches) {
    try {
      await navigator.share({ text });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  const ok = await copyText(text);
  toast(ok ? 'Copied' : 'Couldn’t copy', ok ? 'check' : 'xmark');
}

export function report(game: Game): void {
  saveGame(game);
  const score = total(game.rounds);
  const km = altitudeKm(score);
  const challengeUrl = pageUrl() + challengeHash(game.seed, game.rounds);
  const label = game.mode === 'daily' ? `#${dayNumber(game.date)}` : `∞ ${game.seed}`;

  let versus = '';
  if (game.challenge) {
    const theirs = scoreFromDigits(game.challenge.digits);
    const verdict = score > theirs ? 'You win' : score < theirs ? 'They win' : 'Tie';
    versus = `<section class="group">
      <div class="row">
        ${iconTile(score >= theirs ? 'yellow' : 'gray', 'trophy')}
        <div class="row-text"><div class="row-title">${verdict}</div><div class="row-sub">You ${score} pts · Them ${theirs} pts</div></div>
        ${dots(digitTiers(game.challenge.digits))}
      </div>
    </section>`;
  }

  const rows = game.rounds
    .map((round, i) => {
      const prompt = game.prompts[i];
      const lists = [...TIERS]
        .reverse()
        .map((t) => {
          const names = prompt.answers
            .filter((a) => a.tier === t.id)
            .map((a) => (a.display === round.answer ? `<mark>${esc(a.display)}</mark>` : esc(a.display)));
          return names.length
            ? `<div class="answers-tier tier-${t.id}"><div class="answers-head">${tierTile(t.id, 'xs')}${t.name}<span>${t.points}</span></div><p>${names.join(', ')}</p></div>`
            : '';
        })
        .join('');
      const yours = round.answer ? esc(round.answer) : round.input ? `“${esc(round.input)}” wasn’t on the list` : 'No answer';
      return `<details class="row-details tier-${round.tier ?? 'miss'}">
        <summary class="row">
          ${tierTile(round.tier)}
          <div class="row-text"><div class="row-title">${esc(prompt.text)}</div><div class="row-sub">${yours}</div></div>
          <span class="pts">+${round.points}</span>
          ${icon('chevron-down', 'chev')}
        </summary>
        <div class="answers">${lists}</div>
      </details>`;
    })
    .join('');

  mount(
    `<div class="app report">
      <div class="navbar"><button class="nav-btn" data-act="done">Done</button></div>
      <header class="large-title">
        <div class="eyebrow">${game.mode === 'daily' ? `Daily mission #${dayNumber(game.date)}` : `Unlimited · ${esc(game.seed)}`}</div>
        <h1>Mission Report</h1>
      </header>
      <main>
        <section class="hero hero-report ${score / MAX_SCORE > 0.3 ? 'starry' : ''}" style="${skyStyle(score)}">
          <div class="hero-moon ${score === MAX_SCORE ? 'landed' : ''}"></div>
          <div class="hero-eyebrow">Final altitude</div>
          <div class="hero-alt">${formatAltitude(km)}</div>
          <div class="hero-sub">${esc(landmarkAt(km).label)}</div>
          <div class="hero-foot"><span class="hero-score">${score} of ${MAX_SCORE} points</span>${dots(game.rounds.map((r) => r.tier))}</div>
        </section>
        ${versus}
        <div class="button-row">
          <button class="btn btn-filled" data-act="share">${icon('share')} Share</button>
          ${game.mode === 'unlimited' ? `<button class="btn btn-gray" data-act="challenge">${icon('link')} Challenge</button>` : ''}
        </div>
        <div class="section-header">Prompts</div>
        <section class="group">${rows}</section>
        <section class="group">
          <button class="row row-button" data-act="again">
            ${iconTile('blue', 'infinity')}
            <div class="row-text"><div class="row-title">New Unlimited Mission</div></div>
            ${icon('chevron-right', 'chev')}
          </button>
        </section>
      </main>
    </div>`,
    {
      done: () => nav.home(game.returnTo),
      share: () => void share(shareText(label, game.rounds, game.mode === 'daily' ? pageUrl() : challengeUrl)),
      challenge: async () => {
        const ok = await copyText(challengeUrl);
        toast(ok ? 'Challenge link copied' : 'Couldn’t copy', ok ? 'link' : 'xmark');
      },
      again: () => nav.play(unlimitedGame(randomSeed())),
    },
  );
}
