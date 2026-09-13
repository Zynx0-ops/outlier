import type { Game } from './game';
import { icon, TIER_ICON, type IconName } from './icons';
import type { TierId } from './types';

export type Tab = 'play' | 'stats' | 'help';

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const pageUrl = (): string => location.origin + location.pathname;

/** Filled in by main.ts so screens can navigate without importing each other. */
export const nav = {
  home: (_tab?: Tab): void => {},
  play: (_game: Game): void => {},
  report: (_game: Game): void => {},
};

const root = document.querySelector<HTMLDivElement>('#app')!;
let actions: Record<string, (el: HTMLElement) => void> = {};
let cleanups: (() => void)[] = [];

root.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
  if (el) actions[el.dataset.act!]?.(el);
});

export function mount(html: string, handlers: Record<string, (el: HTMLElement) => void>): HTMLDivElement {
  for (const fn of cleanups.splice(0)) fn();
  actions = handlers;
  root.innerHTML = html;
  window.scrollTo(0, 0);
  return root;
}

export const onUnmount = (fn: () => void): void => {
  cleanups.push(fn);
};

export const tierTile = (tier: TierId | null, size = ''): string =>
  `<span class="tile ${size} tier-${tier ?? 'miss'}">${icon(tier ? TIER_ICON[tier] : 'xmark')}</span>`;

export const iconTile = (color: string, name: IconName, size = ''): string =>
  `<span class="tile ${size}" style="--tier:var(--${color})">${icon(name)}</span>`;

export const dots = (tiers: (TierId | null)[]): string =>
  `<span class="dots">${tiers.map((t) => `<i class="tier-${t ?? 'miss'}"></i>`).join('')}</span>`;

let toastTimer = 0;

/** A centered HUD, like the one iOS shows after copying. */
export function toast(message: string, name: IconName = 'check'): void {
  let el = document.querySelector<HTMLDivElement>('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.innerHTML = `${icon(name)}<span>${esc(message)}</span>`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 1600);
}

export function confirmAlert(o: { title: string; message: string; confirm: string }): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'alert';
    dialog.innerHTML = `
      <div class="alert-body"><h3>${esc(o.title)}</h3><p>${esc(o.message)}</p></div>
      <form method="dialog" class="alert-actions">
        <button value="cancel">Cancel</button>
        <button value="ok" class="destructive">${esc(o.confirm)}</button>
      </form>`;
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      resolve(dialog.returnValue === 'ok');
      dialog.remove();
    });
    dialog.showModal();
  });
}
