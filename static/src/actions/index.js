import makeActionCreator from './makeActionCreator';
import { DISPLAY_MESSAGE, UPDATE_METRONOME_STATUS, SET_TEMPO,
  STARTSTOP_METRONOME } from './actionTypes';

export const displaySystemMessage = makeActionCreator(DISPLAY_MESSAGE,
  'message', 'status');

export const updateMetronomeStatus = makeActionCreator(UPDATE_METRONOME_STATUS,
  'bar', 'beat', 'note');

export const setTempo = makeActionCreator(SET_TEMPO,
  'tempo');

export const startStopMetronome = makeActionCreator(STARTSTOP_METRONOME,
  'isPlaying');
