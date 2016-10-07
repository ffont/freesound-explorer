import makeActionCreator from 'utils/makeActionCreator';

export const actionsToBeSaved = [];

export const actionRequiresSave = actionType => [...actionsToBeSaved, actionType];

export const UPDATE_SESSION_NAME = 'UPDATE_SESSION_NAME';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_AVAILABLE_USER_SESSIONS = 'SET_AVAILABLE_USER_SESSIONS';
export const SET_AVAILABLE_DEMO_SESSIONS = 'SET_AVAILABLE_DEMO_SESSIONS';

export const updateSessionName = makeActionCreator(UPDATE_SESSION_NAME, 'name');
export const setSessionID = makeActionCreator(SET_SESSION_ID, 'id');
export const setAvailableUserSessions = makeActionCreator(
  SET_AVAILABLE_USER_SESSIONS, 'availableUserSessions');
export const setAvailableDemoSessions = makeActionCreator(
  SET_AVAILABLE_DEMO_SESSIONS, 'availableDemoSessions');
