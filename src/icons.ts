import type { TierId } from './types';

/** SF Symbols–style line icons on a 24×24 grid. */
const PATHS = {
  xmark: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7 5.5-5.5"/>',
  'xmark-circle': '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
  'chevron-right': '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  'chevron-down': '<path d="M5.5 9.5 12 16l6.5-6.5"/>',
  'arrow-up': '<path d="M12 19V5.5M5.5 12 12 5.5l6.5 6.5"/>',
  forward: '<path d="M4.5 6l6 6-6 6M12.5 6l6 6-6 6"/>',
  share:
    '<path d="M12 3.5v11M7.8 7.7 12 3.5l4.2 4.2"/><path d="M8.5 10.5H7A2 2 0 0 0 5 12.5v6A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.5"/>',
  link: '<path d="M10 13.5a4.2 4.2 0 0 0 6 .3l3-3a4.2 4.2 0 0 0-6-6l-1.2 1.2"/><path d="M14 10.5a4.2 4.2 0 0 0-6-.3l-3 3a4.2 4.2 0 0 0 6 6l1.2-1.2"/>',
  infinity: '<path d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4Zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4Z"/>',
  rocket:
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  chart: '<rect x="4" y="12" width="4" height="8" rx="1.2"/><rect x="10" y="7" width="4" height="13" rx="1.2"/><rect x="16" y="3.5" width="4" height="16.5" rx="1.2"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.6v.4"/><path d="M12 16.9v.1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  retry: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5V9H15"/>',
  flame:
    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  trophy:
    '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M16 5.5h2.5V7a3 3 0 0 1-3 3M8 5.5H5.5V7a3 3 0 0 0 3 3"/><path d="M12 13v3.5M8.5 20.5h7M9.5 20.5c0-2 1-4 2.5-4s2.5 2 2.5 4"/>',
  people:
    '<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5a3.2 3.2 0 0 1 0 6.1M17.5 13.9a6 6 0 0 1 3.5 5.6"/>',
  bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  diamond: '<path d="M7 4h10l4 5.5L12 20 3 9.5 7 4Z"/><path d="M3 9.5h18M9.5 4 8 9.5 12 20l4-10.5L14.5 4"/>',
  sparkles:
    '<path d="M10 3.5l1.6 4.9 4.9 1.6-4.9 1.6-1.6 4.9-1.6-4.9L3.5 10l4.9-1.6L10 3.5Z"/><path d="M18 14l.8 2.2 2.2.8-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z"/>',
  star: '<path fill="currentColor" d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17l-5.38 2.85 1.03-6L3.3 9.6l6-.9L12 3.2Z"/>',
  plane:
    '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
} as const;

export type IconName = keyof typeof PATHS;

export function icon(name: IconName, cls = ''): string {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
}

export const TIER_ICON: Record<TierId, IconName> = {
  obvious: 'people',
  clever: 'bulb',
  uncommon: 'leaf',
  rare: 'diamond',
  deep: 'sparkles',
  outlier: 'star',
};
