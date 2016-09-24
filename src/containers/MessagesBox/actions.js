import makeActionCreator from '../../utils/makeActionCreator';

export const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';

export const displaySystemMessage = makeActionCreator(DISPLAY_MESSAGE,
  'message', 'status');
