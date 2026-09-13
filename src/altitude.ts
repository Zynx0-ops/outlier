import { ROUNDS } from './schedule';

export const MAX_SCORE = ROUNDS * 100;
export const MOON_KM = 384_400;

/** Exponential climb: 0 points is the launchpad, a perfect game lands on the Moon. */
export const altitudeKm = (score: number): number =>
  Math.pow(MOON_KM + 1, Math.max(0, Math.min(score, MAX_SCORE)) / MAX_SCORE) - 1;

export interface Landmark {
  km: number;
  label: string;
}

export const LANDMARKS: readonly Landmark[] = [
  { km: 0, label: 'Launchpad' },
  { km: 0.83, label: 'Top of the Burj Khalifa' },
  { km: 8.85, label: 'Summit of Everest' },
  { km: 11, label: 'Where airliners cruise' },
  { km: 39, label: 'Baumgartner’s skydive' },
  { km: 100, label: 'Kármán line — space begins' },
  { km: 408, label: 'International Space Station' },
  { km: 540, label: 'Hubble Space Telescope' },
  { km: 1_000, label: 'Inner Van Allen belt' },
  { km: 20_200, label: 'GPS satellites' },
  { km: 35_786, label: 'Geostationary orbit' },
  { km: 100_000, label: 'Earth is a marble' },
  { km: MOON_KM, label: 'The Moon' },
];

export function landmarkAt(km: number): Landmark {
  let current = LANDMARKS[0];
  for (const l of LANDMARKS) if (km >= l.km) current = l;
  return current;
}

export function formatAltitude(km: number): string {
  if (km < 1) return `${Math.round(km * 1000).toLocaleString('en-US')} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString('en-US')} km`;
}
