import makeActionCreator from './makeActionCreator';
import { DISPLAY_MESSAGE, UPDATE_METRONOME_INFO } from './actionTypes';

export const displaySystemMessage = makeActionCreator(DISPLAY_MESSAGE,
  'message', 'status');

export const updateMetronomeInfo = makeActionCreator(UPDATE_METRONOME_INFO,
  'bar', 'beat', 'note', 'time');
