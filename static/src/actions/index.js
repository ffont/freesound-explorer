import makeActionCreator from './makeActionCreator';
import { DISPLAY_MESSAGE, UPDATE_METRONOME_STATUS, SET_TEMPO,
  STARTSTOP_METRONOME, ADD_PATH, SET_PATH_SYNC, STARTSTOP_PATH,
  SET_PATH_CURRENTLY_PLAYING, SELECT_PATH } from './actionTypes';

export const displaySystemMessage = makeActionCreator(DISPLAY_MESSAGE,
  'message', 'status');

export const updateMetronomeStatus = makeActionCreator(UPDATE_METRONOME_STATUS,
  'bar', 'beat', 'tick');

export const setTempo = makeActionCreator(SET_TEMPO,
  'tempo');

export const startStopMetronome = makeActionCreator(STARTSTOP_METRONOME,
  'isPlaying');

export const addPath = makeActionCreator(ADD_PATH,
  'sounds');

export const setPathSync = makeActionCreator(SET_PATH_SYNC,
  'pathIdx', 'syncMode');

export const startStopPath = makeActionCreator(STARTSTOP_PATH,
  'pathIdx', 'isPlaying');

export const setPathCurrentlyPlaying = makeActionCreator(SET_PATH_CURRENTLY_PLAYING,
  'pathIdx', 'soundIdx', 'willFinishAt');

export const selectPath = makeActionCreator(SELECT_PATH,
  'pathIdx');
