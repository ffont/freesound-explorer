import { UPDATE_SESSION_NAME, SET_SESSION_ID, SET_AVAILABLE_USER_SESSIONS,
  SET_AVAILABLE_DEMO_SESSIONS, actionsToBeSaved } from './actions';
import storable from '../SessionsHandler/storableReducer';

export const initialState = {
  author: '',
  name: '',
  id: '',
  date: {},
  hasUnsavedProgress: false,
  availableUserSessions: [],
  availableDemoSessions: [],
};

const author = (state = initialState.author, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const name = (state = initialState.name, action) => {
  switch (action.type) {
    case UPDATE_SESSION_NAME:
      return action.name;
    default:
      return state;
  }
};

const sessionID = (state = initialState.id, action) => {
  switch (action.type) {
    case SET_SESSION_ID:
      return action.id;
    default:
      return state;
  }
};

const availableUserSessions = (state = initialState.availableUserSessions, action) => {
  switch (action.type) {
    case SET_AVAILABLE_USER_SESSIONS:
      return action.availableUserSessions;
    default:
      return state;
  }
};

const availableDemoSessions = (state = initialState.availableDemoSessions, action) => {
  switch (action.type) {
    case SET_AVAILABLE_DEMO_SESSIONS:
      return action.availableDemoSessions;
    default:
      return state;
  }
};

const date = (state = initialState.date, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const hasUnsavedProgress = (state = initialState.hasUnsavedProgress, action) => {
  if (!state && actionsToBeSaved.includes(action.type)) {
    return true;
  }
  return state;
};

const session = (state = initialState, action) => ({
  author: author(state.author, action),
  name: name(state.name, action),
  id: sessionID(state.id, action),
  date: date(state.date, action),
  hasUnsavedProgress: hasUnsavedProgress(state.hasUnsavedProgress, action),
  availableUserSessions: availableUserSessions(state.availableUserSessions, action),
  availableDemoSessions: availableDemoSessions(state.availableDemoSessions, action),
});

export default storable(session);
