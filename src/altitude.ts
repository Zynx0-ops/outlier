import { ROUNDS } from './schedule';

export const MAX_SCORE = ROUNDS * 100;
export const MOON_KM = 384_400;

/** Exponential climb: 0 points is the launchpad, a perfect game lands on the Moon. */
export const altitudeKm = (score: number): number =>
  Math.pow(MOON_KM + 1, Math.max(0, Math.min(score, MAX_SCORE)) / MAX_SCORE) - 1;

/** Inverse of altitudeKm — where a given altitude sits on the 0–700 point scale. */
export const kmToPoints = (km: number): number => (MAX_SCORE * Math.log(km + 1)) / Math.log(MOON_KM + 1);

export interface Landmark {
  km: number;
  label: string;
  short: string;
}

export const LANDMARKS: readonly Landmark[] = [
  { km: 0, label: 'Launchpad', short: 'Launchpad' },
  { km: 0.83, label: 'Top of the Burj Khalifa', short: 'Burj Khalifa' },
  { km: 8.85, label: 'Summit of Everest', short: 'Everest' },
  { km: 11, label: 'Where airliners cruise', short: 'Airliners' },
  { km: 39, label: 'Baumgartner’s skydive', short: 'Record skydive' },
  { km: 100, label: 'Kármán line — space begins', short: 'Kármán line' },
  { km: 408, label: 'International Space Station', short: 'ISS' },
  { km: 540, label: 'Hubble Space Telescope', short: 'Hubble' },
  { km: 1_000, label: 'Inner Van Allen belt', short: 'Van Allen belt' },
  { km: 20_200, label: 'GPS satellites', short: 'GPS' },
  { km: 35_786, label: 'Geostationary orbit', short: 'Geostationary' },
  { km: 100_000, label: 'Earth is a marble', short: 'Earth is a marble' },
  { km: MOON_KM, label: 'The Moon', short: 'The Moon' },
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
