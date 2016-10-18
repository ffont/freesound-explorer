import makeActionCreator from 'utils/makeActionCreator';

export const TOGGLE_PLAY_ON_HOVER = 'TOGGLE_PLAY_ON_HOVER';
export const SET_SHOULD_PLAY_ON_HOVER = 'SET_SHOULD_PLAY_ON_HOVER';
export const TOGGLE_METRONOME_SOUND = 'TOGGLE_METRONOME_SOUND';

export const togglePlayOnHover = makeActionCreator(TOGGLE_PLAY_ON_HOVER);
export const setShouldPlayOnHover = makeActionCreator(SET_SHOULD_PLAY_ON_HOVER, 'shouldPlayOnHover');
export const toggleMetronomeSound = makeActionCreator(TOGGLE_METRONOME_SOUND);
