import makeActionCreator from 'utils/makeActionCreator';

export const UPDATE_SESSION_NAME = 'UPDATE_SESSION_NAME';
export const SET_SESSION_ID = 'SET_SESSION_ID';

export const updateSessionName = makeActionCreator(UPDATE_SESSION_NAME, 'name');
export const setSessionID = makeActionCreator(SET_SESSION_ID, 'id');
