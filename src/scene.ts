import { formatAltitude, kmToPoints, LANDMARKS, MAX_SCORE } from './altitude';
import { mulberry32 } from './schedule';
import {
  CLOUD,
  EARTH,
  FLAME_A,
  FLAME_B,
  FLAME_SMALL,
  MOON,
  PALETTE,
  pixelSvg,
  PLANE,
  ROCKET,
  SATELLITE,
  SMOKE,
  SPARKLE,
} from './sprites';

/** Vertical pixels of sky per point scored. */
export const PX_PER_POINT = 14;

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;
const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Sky colours from the ground up to deep space. The sky is drawn as hard bands, never a smooth gradient. */
const SKY_RAMP = ['#7fd4ff', '#29adff', '#1f7fd1', '#2a4d9a', '#1d2b53', '#141d3a', '#0b1024', '#000000'];

export function skyBands(lift: number): string {
  const i = Math.min(SKY_RAMP.length - 3, Math.floor(clamp(lift, 0, 1) * 9));
  const [low, mid, high] = [SKY_RAMP[i], SKY_RAMP[i + 1], SKY_RAMP[i + 2]];
  return `linear-gradient(180deg, ${high} 0 40%, ${mid} 40% 72%, ${low} 72% 100%)`;
}

export const rocketSvg = (cls = 'rocket'): string => pixelSvg(ROCKET, cls);

let starTile: string | null = null;

function stars(): string {
  if (starTile) return starTile;
  const c = document.createElement('canvas');
  c.width = c.height = 160;
  const ctx = c.getContext('2d');
  const rand = mulberry32(11);
  const colors = [PALETTE.W, PALETTE.W, PALETTE.F, PALETTE.A];
  for (let i = 0; ctx && i < 46; i++) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    const size = rand() < 0.8 ? 1 : 2;
    ctx.fillRect(Math.floor(rand() * 160), Math.floor(rand() * 160), size, size);
  }
  starTile = `url(${c.toDataURL()})`;
  return starTile;
}

function worldHtml(): string {
  const at = (km: number) => `bottom:${Math.round(kmToPoints(km) * PX_PER_POINT)}px`;
  const clouds: [km: number, left: number][] = [
    [1.1, 14],
    [2, 78],
    [3.4, 26],
    [5.2, 84],
    [7.5, 10],
  ];
  return [
    '<div class="ground"></div><div class="tower"></div><div class="pad"></div>',
    ...clouds.map(([km, left]) => `<div class="sprite cloud" style="${at(km)};left:${left}%">${pixelSvg(CLOUD)}</div>`),
    `<div class="sprite plane" style="${at(11)};left:74%">${pixelSvg(PLANE)}</div>`,
    `<div class="sprite sat" style="${at(408)};left:24%">${pixelSvg(SATELLITE)}</div>`,
    `<div class="sprite sat" style="${at(540)};left:76%">${pixelSvg(SATELLITE)}</div>`,
    `<div class="sprite sat" style="${at(20_200)};left:20%">${pixelSvg(SATELLITE)}</div>`,
    `<div class="sprite sat" style="${at(35_786)};left:80%">${pixelSvg(SATELLITE)}</div>`,
    `<div class="sprite earth" style="${at(100_000)};left:22%">${pixelSvg(EARTH)}</div>`,
    `<div class="sprite moon" style="bottom:${MAX_SCORE * PX_PER_POINT}px">${pixelSvg(MOON)}</div>`,
    ...LANDMARKS.slice(1).map(
      (l) => `<div class="mark" style="${at(l.km)}"><span>${l.short}</span><span>${formatAltitude(l.km)}</span></div>`,
    ),
  ].join('');
}

export type SceneMode = 'ask' | 'flight' | 'result';

/**
 * The sky the rocket climbs through. The rocket never moves on screen;
 * the world scrolls beneath it, snapped to whole pixels.
 */
export class Scene {
  readonly el = document.createElement('div');
  onFrame: (score: number) => void = () => {};
  destroyed = false;

  private world: HTMLElement;
  private starsEl: HTMLElement;
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
      <div class="ship">
        <div class="sparkles">${pixelSvg(SPARKLE).repeat(4)}</div>
        <div class="smoke">${pixelSvg(SMOKE).repeat(3)}</div>
        <div class="flame">${pixelSvg(FLAME_SMALL, 'f-small')}${pixelSvg(FLAME_A, 'f-a')}${pixelSvg(FLAME_B, 'f-b')}</div>
        ${rocketSvg()}
      </div>`;
    this.world = this.el.querySelector('.world')!;
    this.starsEl = this.el.querySelector('.scene-stars')!;
    this.starsEl.style.backgroundImage = stars();
    this.el.addEventListener('click', () => this.skip());
  }

  setMode(mode: SceneMode): void {
    this.el.dataset.mode = mode;
  }

  jump(score: number): void {
    this.cam = score;
    this.render();
    this.onFrame(score);
  }

  /** Ignite, climb to `score` with the camera locked on the rocket, then idle. */
  async fly(score: number): Promise<void> {
    this.skipping = false;
    const from = this.cam;
    if (score <= from || prefersReducedMotion()) return this.jump(score);

    this.setFlame('ignite');
    await this.delay(320);
    if (this.destroyed) return;
    this.setFlame('thrust');

    const duration = clamp(600 + (score - from) * 16, 900, 2400);
    await new Promise<void>((resolve) => {
      const start = performance.now();
      const step = (now: number) => {
        if (this.destroyed) return resolve();
        const t = this.skipping ? 1 : Math.min(1, (now - start) / duration);
        this.cam = from + (score - from) * easeInOut(t);
        this.render();
        this.onFrame(this.cam);
        if (t < 1) this.raf = requestAnimationFrame(step);
        else resolve();
      };
      this.raf = requestAnimationFrame(step);
    });
    this.setFlame(null);
  }

  /** A miss: the engine sputters, puffs smoke and goes nowhere. */
  async stall(): Promise<void> {
    this.skipping = false;
    this.el.classList.add('stalling');
    await this.delay(prefersReducedMotion() ? 0 : 1000);
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

  private setFlame(state: 'ignite' | 'thrust' | null): void {
    this.el.classList.toggle('ignite', state === 'ignite');
    this.el.classList.toggle('thrust', state === 'thrust');
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

  private render(): void {
    // Snap to a 2px grid so sprites never land on half pixels.
    const y = Math.round((this.cam * PX_PER_POINT) / 2) * 2;
    const lift = this.cam / MAX_SCORE;
    this.el.style.background = skyBands(lift);
    this.world.style.transform = `translate3d(0, ${y}px, 0)`;
    // Stars fade in near the edge of space (~250 points), in quarter steps.
    this.starsEl.style.opacity = String(Math.round(clamp((lift - 0.28) * 4, 0, 1) * 4) / 4);
    this.starsEl.style.backgroundPosition = `0 ${Math.round(y * 0.05)}px`;
    this.el.classList.toggle('aloft', this.cam > 0.5);
  }
}
