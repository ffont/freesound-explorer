import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';

export const displaySystemMessage = makeActionCreator(at.DISPLAY_MESSAGE,
  'message', 'status');
