import { kmToPoints, LANDMARKS, MAX_SCORE, formatAltitude } from './altitude';
import { icon } from './icons';
import { mulberry32 } from './schedule';

/** Vertical pixels of sky per point scored. A 100-point answer climbs 1,400px. */
export const PX_PER_POINT = 14;

type Rgb = [number, number, number];
const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Sky colour stops by lift (0 = launchpad, 1 = Moon): [lift, top, horizon]. */
const SKY: [number, Rgb, Rgb][] = (
  [
    [0, '#4A9BEA', '#C4E3FF'],
    [0.16, '#2C6BD0', '#86BDF2'],
    [0.28, '#1A3A8C', '#4F7FD0'],
    [0.36, '#0A1745', '#243F85'],
    [0.48, '#03061A', '#0B1638'],
    [1, '#000000', '#04050D'],
  ] as const
).map(([at, top, bottom]) => [at, hex(top), hex(bottom)]);

const mix = (a: Rgb, b: Rgb, t: number): string => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

export function skyColors(lift: number): [top: string, horizon: string] {
  const l = clamp(lift, 0, 1);
  let i = 0;
  while (i < SKY.length - 2 && l > SKY[i + 1][0]) i++;
  const [a, aTop, aBottom] = SKY[i];
  const [b, bTop, bBottom] = SKY[i + 1];
  const t = clamp((l - a) / (b - a), 0, 1);
  return [mix(aTop, bTop, t), mix(aBottom, bBottom, t)];
}

const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function shipSvg(id: string): string {
  const hull = 'M28 2C41 14 44 36 42 60L40 90H16L14 60C12 36 15 14 28 2Z';
  return `<svg viewBox="0 0 56 106" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-hull" x1="0" x2="1"><stop offset="0" stop-color="#C9CFDA"/><stop offset=".45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#AEB6C4"/></linearGradient>
      <clipPath id="${id}-nose"><rect width="56" height="19"/></clipPath>
    </defs>
    <path d="M14.5 60 3 79v15l13.5-8Z" fill="#FF3B30"/>
    <path d="M41.5 60 53 79v15l-13.5-8Z" fill="#E0342B"/>
    <path d="${hull}" fill="url(#${id}-hull)"/>
    <path d="${hull}" fill="#FF3B30" clip-path="url(#${id}-nose)"/>
    <circle cx="28" cy="40" r="7.5" fill="#0A84FF" stroke="#E5E5EA" stroke-width="3"/>
    <path d="M24.6 37.8a4.2 4.2 0 0 1 3.8-2.6" stroke="#fff" stroke-opacity=".75" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M28 64v24" stroke="#FF3B30" stroke-width="4" stroke-linecap="round"/>
    <rect x="19" y="89" width="18" height="8" rx="2" fill="#636366"/>
  </svg>`;
}

const CLOUD =
  '<svg viewBox="0 0 120 50" aria-hidden="true"><path d="M20 45H100A18 18 0 0 0 96 10 24 24 0 0 0 52 8 16 16 0 0 0 26 22 12 12 0 0 0 20 45Z" fill="#fff"/></svg>';

const SATELLITE = `<svg viewBox="0 0 84 36" aria-hidden="true">
  <path d="M30 18h24" stroke="#D1D1D6" stroke-width="3"/>
  <rect x="2" y="6" width="28" height="24" rx="2.5" fill="#0A84FF"/>
  <rect x="54" y="6" width="28" height="24" rx="2.5" fill="#0A84FF"/>
  <path d="M16 6v24M68 6v24M2 18h28M54 18h28" stroke="#fff" stroke-opacity=".35"/>
  <rect x="36" y="10" width="12" height="16" rx="3" fill="#F2F2F7"/>
</svg>`;

let tiles: { stars: string; streaks: string } | null = null;

function patternTiles(): { stars: string; streaks: string } {
  if (tiles) return tiles;
  const rand = mulberry32(7);
  const canvas = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): string => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (ctx) draw(ctx);
    return `url(${c.toDataURL()})`;
  };
  tiles = {
    stars: canvas(320, 320, (ctx) => {
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 80; i++) {
        ctx.globalAlpha = 0.35 + rand() * 0.65;
        ctx.beginPath();
        ctx.arc(rand() * 320, rand() * 320, rand() < 0.9 ? 0.5 + rand() * 0.7 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }),
    streaks: canvas(240, 480, (ctx) => {
      ctx.strokeStyle = '#fff';
      ctx.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        const x = rand() * 240;
        const y = rand() * 480;
        ctx.globalAlpha = 0.2 + rand() * 0.35;
        ctx.lineWidth = 1 + rand();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 40 + rand() * 140);
        ctx.stroke();
      }
    }),
  };
  return tiles;
}

function worldHtml(): string {
  const at = (km: number) => `bottom:${Math.round(kmToPoints(km) * PX_PER_POINT)}px`;
  const clouds: [km: number, left: number, scale: number][] = [
    [1.1, 16, 1],
    [2, 76, 0.8],
    [3.4, 28, 1.25],
    [5.2, 82, 0.95],
    [7.5, 10, 0.75],
  ];
  return [
    '<div class="ground"></div><div class="tower"></div><div class="pad"></div>',
    ...clouds.map(([km, left, s]) => `<div class="cloud" style="${at(km)};left:${left}%;--s:${s}">${CLOUD}</div>`),
    `<div class="decor plane" style="${at(11)};left:74%">${icon('plane')}</div>`,
    `<div class="decor sat" style="${at(408)};left:24%">${SATELLITE}</div>`,
    `<div class="decor sat small" style="${at(540)};left:76%">${SATELLITE}</div>`,
    `<div class="decor sat small" style="${at(20_200)};left:20%">${SATELLITE}</div>`,
    `<div class="decor sat small" style="${at(35_786)};left:80%">${SATELLITE}</div>`,
    `<div class="decor earth" style="${at(100_000)};left:22%"></div>`,
    `<div class="moon" style="bottom:${MAX_SCORE * PX_PER_POINT}px"></div>`,
    ...LANDMARKS.slice(1).map(
      (l) =>
        `<div class="mark" style="${at(l.km)}"><span>${l.short}</span><span class="mark-km">${formatAltitude(l.km)}</span></div>`,
    ),
  ].join('');
}

export type SceneMode = 'ask' | 'flight' | 'sheet';

/**
 * A full-screen sky that the rocket climbs through. The rocket stays put on
 * screen; the world scrolls beneath it, so the camera "rides along".
 */
export class Scene {
  readonly el = document.createElement('div');
  onFrame: (score: number) => void = () => {};
  destroyed = false;

  private world: HTMLElement;
  private stars: HTMLElement;
  private streaks: HTMLElement;
  private cam = 0;
  private raf = 0;
  private skipping = false;
  private wake: (() => void) | null = null;

  constructor() {
    this.el.className = 'scene';
    this.el.dataset.mode = 'ask';
    this.el.innerHTML = `
      <div class="scene-stars"></div>
      <div class="world">${worldHtml()}</div>
      <div class="scene-streaks"></div>
      <div class="ship-wrap">
        <div class="ship-glow"></div><div class="ship-glow late"></div>
        <div class="flame"><i></i></div>
        <div class="smoke"><i></i><i></i><i></i></div>
        <div class="ship-body">${shipSvg('scene')}</div>
      </div>`;
    this.world = this.el.querySelector('.world')!;
    this.stars = this.el.querySelector('.scene-stars')!;
    this.streaks = this.el.querySelector('.scene-streaks')!;
    const { stars, streaks } = patternTiles();
    this.stars.style.backgroundImage = stars;
    this.streaks.style.backgroundImage = streaks;
    this.el.addEventListener('click', () => this.skip());
  }

  setMode(mode: SceneMode): void {
    this.el.dataset.mode = mode;
  }

  jump(score: number): void {
    this.cam = score;
    this.render(0);
    this.onFrame(score);
  }

  /** Climb to `score` points: ignition, a camera-following ascent, then coast. */
  async fly(score: number): Promise<void> {
    this.skipping = false;
    const from = this.cam;
    if (score <= from || prefersReducedMotion()) return this.jump(score);

    this.el.classList.add('ignite');
    await this.delay(450);
    if (this.destroyed) return;
    this.el.classList.add('thrust');

    const duration = clamp(700 + (score - from) * 18, 1000, 2600);
    await new Promise<void>((resolve) => {
      const start = performance.now();
      let lastTime = start;
      let lastCam = from;
      const step = (now: number) => {
        if (this.destroyed) return resolve();
        const t = this.skipping ? 1 : Math.min(1, (now - start) / duration);
        const cam = from + (score - from) * easeInOut(t);
        const speed = ((cam - lastCam) * PX_PER_POINT) / Math.max(1, now - lastTime);
        lastTime = now;
        lastCam = cam;
        this.cam = cam;
        this.render(speed);
        this.onFrame(cam);
        if (t < 1) this.raf = requestAnimationFrame(step);
        else resolve();
      };
      this.raf = requestAnimationFrame(step);
    });

    this.el.classList.remove('ignite', 'thrust');
    this.render(0);
  }

  /** A missed answer: the engine coughs and the rocket goes nowhere. */
  async stall(): Promise<void> {
    this.skipping = false;
    this.el.classList.add('stalling');
    await this.delay(prefersReducedMotion() ? 0 : 1100);
    this.el.classList.remove('stalling');
  }

  celebrate(): void {
    this.el.classList.remove('celebrate');
    void this.el.offsetWidth;
    this.el.classList.add('celebrate');
  }

  skip(): void {
    this.skipping = true;
    this.wake?.();
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.wake?.();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.skipping || ms <= 0) return resolve();
      const id = setTimeout(resolve, ms);
      this.wake = () => {
        clearTimeout(id);
        resolve();
      };
    });
  }

  private render(speed: number): void {
    const y = this.cam * PX_PER_POINT;
    const lift = this.cam / MAX_SCORE;
    const [top, horizon] = skyColors(lift);
    this.el.style.background = `linear-gradient(180deg, ${top}, ${horizon})`;
    this.world.style.transform = `translate3d(0, ${y}px, 0)`;
    this.stars.style.opacity = String(clamp((lift - 0.12) * 3, 0, 1));
    this.stars.style.backgroundPosition = `0 ${y * 0.06}px`;
    this.streaks.style.opacity = String(clamp((speed - 0.25) * 0.5, 0, 0.6));
    this.streaks.style.backgroundPosition = `0 ${y * 1.8}px`;
    this.el.classList.toggle('aloft', this.cam > 0.5);
  }
}
