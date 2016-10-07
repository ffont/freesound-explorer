import { createSelector } from 'reselect';

const selectedSoundsSelector = state => state.sounds.selectedSounds;

export const makeIsSoundSelected = soundID => createSelector(
  [selectedSoundsSelector],
  selectedSounds => selectedSounds.includes(soundID)
);
