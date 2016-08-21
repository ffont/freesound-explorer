import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';

export const updateMetronomeStatus = makeActionCreator(at.UPDATE_METRONOME_STATUS,
  'bar', 'beat', 'tick');

export const setTempo = makeActionCreator(at.SET_TEMPO,
  'tempo');

export const startStopMetronome = makeActionCreator(at.STARTSTOP_METRONOME,
  'isPlaying');
