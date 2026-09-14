/** A 16-colour palette in the spirit of fantasy consoles. One letter per colour. */
export const PALETTE: Record<string, string> = {
  K: '#000000',
  N: '#1d2b53',
  P: '#7e2553',
  D: '#7e2553',
  E: '#008751',
  U: '#ab5236',
  G: '#5f574f',
  L: '#c2c3c7',
  W: '#fff1e8',
  R: '#ff004d',
  O: '#ffa300',
  Y: '#ffec27',
  V: '#00e436',
  B: '#29adff',
  A: '#83769c',
  I: '#ff77a8',
  F: '#ffccaa',
};

export type Sprite = readonly string[];

/**
 * Render a bitmap as a crisp SVG. `.` is transparent, `#` uses currentColor,
 * any other letter is a palette colour. Horizontal runs merge into one rect.
 */
export function pixelSvg(rows: Sprite, cls = ''): string {
  const w = rows[0].length;
  const rects: string[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === c) end++;
      if (c !== '.') {
        const fill = c === '#' ? 'currentColor' : PALETTE[c];
        rects.push(`<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${fill}"/>`);
      }
      x = end;
    }
  });
  return `<svg class="${cls}" viewBox="0 0 ${w} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${rects.join('')}</svg>`;
}

export const ROCKET: Sprite = [
  '.....RR.....',
  '....RRRR....',
  '....RRRD....',
  '...RRRRRD...',
  '...WWWWWL...',
  '...WWWWWL...',
  '...WWNNWL...',
  '...WNBBNL...',
  '...WNBWNL...',
  '...WWNNWL...',
  '...WWWWWL...',
  '...WWWWWL...',
  '...WWRRWL...',
  '..RWWRRWLR..',
  '.RRWWWWWLRR.',
  '.RRWWWWWLRR.',
  'RRRWWWWWLRRD',
  'RRRWWWWWLRRD',
  'RR.GGGGGG.RD',
  'R...GGGG...D',
  '....GGGG....',
];

/** Flame frames share one 6×9 canvas so they line up under the nozzle. */
export const FLAME_SMALL: Sprite = [
  '.YYYY.',
  '.YOOY.',
  '..OO..',
  '..OR..',
  '...R..',
  '......',
  '......',
  '......',
  '......',
];

export const FLAME_A: Sprite = [
  '.YYYY.',
  'YYOOYY',
  '.OOOO.',
  '.OOOO.',
  '..OO..',
  '..RR..',
  '...R..',
  '......',
  '......',
];

export const FLAME_B: Sprite = [
  '.YYYY.',
  'YYWWYY',
  'YOWWOY',
  '.OOOO.',
  '.OOOO.',
  '..OR..',
  '..RR..',
  '..R...',
  '...R..',
];

export const CLOUD: Sprite = [
  '.....WWWW.......',
  '...WWWWWWWW.WW..',
  '.WWWWWWWWWWWWWW.',
  'WWWWWWWWWWWWWWWW',
  'LLLLLLLLLLLLLLLL',
  '.LLLLLLLLLLLLLL.',
];

export const PLANE: Sprite = [
  '..L.........',
  '..LL........',
  'LLWWWWWWWWW.',
  '..WWWWWWWWBW',
  '....LL......',
];

export const SATELLITE: Sprite = [
  'BBBB..L..BBBB',
  'BNBBGWWWGBBNB',
  'BBBB.WWW.BBBB',
  'BBBB..L..BBBB',
];

export const EARTH: Sprite = [
  '..BBBB..',
  '.BBVVBB.',
  'BBVVVBBB',
  'BBBVBBVB',
  'BVBBBVVB',
  'BBBBBVBB',
  '.BBVBBB.',
  '..BBBB..',
];

export const MOON: Sprite = [
  '.....LLLLLL.....',
  '...LLWWWWWWLL...',
  '..LWWWWWWWWWWL..',
  '.LWWWAAWWWWWWWL.',
  '.LWWWAAWWWWWWWL.',
  'LWWWWWWWWWLLWWWL',
  'LWWWWWWWWWLLWWWL',
  'LWWWWWWWWWWWWWWL',
  'LWWLLWWWWWWWWWWL',
  'LWWLLWWWWWWWAWWL',
  'LWWWWWWWWWWWWWWL',
  '.LWWWWWWAAWWWWL.',
  '.LWWWWWWAAWWWWL.',
  '..LWWWWWWWWWWL..',
  '...LLWWWWWWLL...',
  '.....LLLLLL.....',
];

export const SPARKLE: Sprite = [
  '..Y..',
  '..Y..',
  'YYWYY',
  '..Y..',
  '..Y..',
];

export const SMOKE: Sprite = [
  '.LL.',
  'LWWL',
  'LWWL',
  '.LL.',
];
