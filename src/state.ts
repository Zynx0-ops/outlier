import { loadProfile, saveProfile, type Profile } from './storage';

export const state: { profile: Profile } = { profile: loadProfile() };

export function setProfile(profile: Profile): void {
  state.profile = profile;
  saveProfile(profile);
}
