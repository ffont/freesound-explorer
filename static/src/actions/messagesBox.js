import makeActionCreator from './makeActionCreator';
import { DISPLAY_MESSAGE } from './actionTypes';

export const displaySystemMessage = makeActionCreator(DISPLAY_MESSAGE,
  'message', 'status');
