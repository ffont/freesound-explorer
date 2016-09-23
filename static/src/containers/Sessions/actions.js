import makeActionCreator from '../../utils/makeActionCreator';

export const UPDATE_SESSION_NAME = 'UPDATE_SESSION_NAME';

export const updateSessionName = makeActionCreator(UPDATE_SESSION_NAME, 'name');
