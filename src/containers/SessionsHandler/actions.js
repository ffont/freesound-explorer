import { default as UUID } from 'uuid';
import makeActionCreator from 'utils/makeActionCreator';
import { MESSAGE_STATUS, URLS } from 'constants';
import { loadJSON, postJSON } from 'utils/requests';
import { getDataToSave } from './utils';
import { displaySystemMessage } from '../MessagesBox/actions';
import { forceMapPositionUpdate } from '../Map/actions';
import { setSessionID, updateSessionName, setAvailableUserSessions,
  setAvailableDemoSessions } from '../Session/actions';
import { addPathEventListener, removePathEventListener } from '../Paths/actions';
import { stopMetronome } from '../Metronome/actions';
import { setUpMIDIDevices } from '../Midi/actions';

export const NEW_SESSION = 'NEW_SESSION';
export const SAVE_SESSION = 'SAVE_SESSION';
export const LOAD_SESSION = 'LOAD_SESSION';
export const BACKEND_SAVE_REQUEST = 'BACKEND_SAVE_REQUEST';
export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_FAILURE = 'SAVE_FAILURE';
export const BACKEND_LOAD_REQUEST = 'BACKEND_LOAD_REQUEST';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_FAILURE = 'LOAD_FAILURE';
export const DELETE_SUCCESS = 'DELETE_SUCCESS';

// no need to exports all these actions as they will be used internally in saveSession
const backendSaveRequest = makeActionCreator(BACKEND_SAVE_REQUEST);
const saveSuccess = makeActionCreator(SAVE_SUCCESS);
const saveFailure = makeActionCreator(SAVE_FAILURE);
const backendLoadRequest = makeActionCreator(BACKEND_LOAD_REQUEST);
const loadSuccess = makeActionCreator(LOAD_SUCCESS);
const loadFailure = makeActionCreator(LOAD_FAILURE);
const deleteSuccess = makeActionCreator(DELETE_SUCCESS);

export const newSession = makeActionCreator(NEW_SESSION);

const SAVED_SESSIONS_LOCAL_STORAGE_KEY = 'savedSessions';

const saveToBackend = (sessionID, dataToSave) => (dispatch) => {
  let url = URLS.SAVE_SESSION;
  if (sessionID) {
    url = `${url}?sid=${sessionID}`;
  }
  dispatch(backendSaveRequest(sessionID, dataToSave));
  dispatch(displaySystemMessage('Saving session...'));
  postJSON(url, dataToSave).then(
    (data) => {
      dispatch(saveSuccess());
      dispatch(setSessionID(data.sessionID));
      dispatch(updateSessionName(data.sessionName));
      dispatch(displaySystemMessage(
        `Session successfully saved '${data.sessionName}'!`, MESSAGE_STATUS.SUCCESS));
    },
    (data) => {
      const message = (data && data.msg) || 'Unknown error';
      dispatch(saveFailure());
      dispatch(displaySystemMessage(
        `Could not save the session: ${message}`, MESSAGE_STATUS.ERROR));
    }
  );
};

const saveToLocalStorage = (sessionID, dataToSave) => (dispatch) => {
  dispatch(displaySystemMessage('Saving session...'));
  let itemID = sessionID;
  if (!itemID) {
    itemID = UUID.v4();
  }
  let existingSessions = localStorage.getItem(SAVED_SESSIONS_LOCAL_STORAGE_KEY);
  if (!existingSessions) {
    existingSessions = [];
  } else {
    existingSessions = JSON.parse(existingSessions);
  }
  let sessionName = dataToSave.session.name;
  if (!sessionName) {
    sessionName = `Untitled session #${existingSessions.length + 1}`;
  }
  const mutableDataToSave = Object.assign({}, dataToSave);
  mutableDataToSave.session.name = sessionName;
  mutableDataToSave.session.id = itemID;
  const d = new Date();
  const objectToSave = { id: itemID, lastModified: d.toISOString(), data: mutableDataToSave };
  let foundInExistingSessions = false;
  existingSessions = existingSessions.map(session => {
    if (session.id !== sessionID) return session;
    foundInExistingSessions = true;
    return objectToSave;
  });
  if (!foundInExistingSessions) {
    existingSessions.push(objectToSave);
  }
  localStorage.setItem(SAVED_SESSIONS_LOCAL_STORAGE_KEY, JSON.stringify(existingSessions));
  dispatch(saveSuccess());
  dispatch(setSessionID(itemID));
  dispatch(updateSessionName(sessionName));
  dispatch(displaySystemMessage(
    `Session successfully saved '${sessionName}'!`, MESSAGE_STATUS.SUCCESS));
};

export const saveSession = () => (dispatch, getStore) => {
  const currentState = getStore();
  const dataToSave = getDataToSave(currentState);
  if (currentState.login.isEndUserAuthSupported) {
    dispatch(saveToBackend(currentState.session.id, dataToSave));
  } else {
    dispatch(saveToLocalStorage(currentState.session.id, dataToSave));
  }
};

export const saveSessionAs = sessionName => (dispatch, getStore) => {
  dispatch(updateSessionName(sessionName));
  const currentState = getStore();
  const dataToSave = getDataToSave(currentState);
  if (currentState.login.isEndUserAuthSupported) {
    dispatch(saveToBackend(undefined, dataToSave));  // Always create a new session id
  } else {
    dispatch(saveToLocalStorage(undefined, dataToSave));  // Always create a new session id
  }
};

const preRestoreSession = () => (dispatch, getStore) => {
  dispatch(stopMetronome());
  dispatch(forceMapPositionUpdate({ translateX: 0, translateY: 0, scale: 1 }));
  const state = getStore();
  state.paths.paths.forEach(path => dispatch(removePathEventListener(path.id)));
};

const postRestoreSession = () => (dispatch, getStore) => {
  // Use this function to do all the stuff that is needed to
  // make a loaded session ready for playing/continue editing (e.g. setting listeners on paths)
  const state = getStore();
  state.paths.paths.forEach(path => dispatch(addPathEventListener(path.id)));
  dispatch(setUpMIDIDevices());
};

const loadFromBackend = sessionID => (dispatch) => {
  const url = `${URLS.LOAD_SESSION}?sid=${sessionID}`;
  dispatch(backendLoadRequest());
  dispatch(displaySystemMessage('Loading session...'));
  loadJSON(url).then(
    (data) => {
      dispatch(preRestoreSession());
      dispatch(Object.assign({}, data.data, { type: LOAD_SESSION }));
      dispatch(postRestoreSession());
      dispatch(loadSuccess());
      dispatch(displaySystemMessage(
        'Session loaded!', MESSAGE_STATUS.SUCCESS));
    },
    (data) => {
      const message = (data && data.msg) || 'Unknown error';
      dispatch(loadFailure());
      dispatch(displaySystemMessage(
        `Error loading session: ${message}`, MESSAGE_STATUS.ERROR));
    }
  );
};

const loadFromLocalStorage = sessionID => (dispatch) => {
  const existingSessions = localStorage.getItem(SAVED_SESSIONS_LOCAL_STORAGE_KEY);
  let filteredSessions = [];
  if (existingSessions) {
    filteredSessions = JSON.parse(existingSessions).filter(session => session.id === sessionID);
  }
  if (filteredSessions.length) {
    dispatch(preRestoreSession());
    dispatch(Object.assign({}, filteredSessions[0].data, { type: LOAD_SESSION }));
    dispatch(postRestoreSession());
    dispatch(loadSuccess());
    dispatch(displaySystemMessage(
      'Session loaded!', MESSAGE_STATUS.SUCCESS));
  } else {
    dispatch(displaySystemMessage(
      'Session not found...', MESSAGE_STATUS.ERROR));
  }
};

export const loadSession = sessionID => (dispatch, getStore) => {
  const currentState = getStore();
  if (currentState.login.isEndUserAuthSupported) {
    dispatch(loadFromBackend(sessionID));
  } else {
    dispatch(loadFromLocalStorage(sessionID));
  }
};

export const getAvailableSessionsBackend = () => (dispatch) => {
  loadJSON(URLS.AVAILABLE_SESSIONS).then(
    (data) => {
      dispatch(setAvailableUserSessions(data.userSessions));
      dispatch(setAvailableDemoSessions(data.demoSessions));
    },
    (data) => {
      const message = (data && data.msg) || 'Unknown error';
      dispatch(displaySystemMessage(
        `Error loading available sessions: ${message}`, MESSAGE_STATUS.ERROR));
    }
  );
};

export const getAvailableSessionsLocalStorage = () => (dispatch) => {
  const existingSessions = localStorage.getItem(SAVED_SESSIONS_LOCAL_STORAGE_KEY);
  if (existingSessions) {
    const formattedSessions = JSON.parse(existingSessions).map((session) => {
      return {
        name: session.data.session.name,
        id: session.id,
        lastModified: session.lastModified,
        author: session.data.session.author,
      };
    });
    dispatch(setAvailableUserSessions(formattedSessions));
  } else {
    dispatch(setAvailableUserSessions([]));
  }
};

export const getAvailableSessions = () => (dispatch, getStore) => {
  const currentState = getStore();
  if (currentState.login.isEndUserAuthSupported) {
    dispatch(getAvailableSessionsBackend());
  } else {
    dispatch(getAvailableSessionsLocalStorage());
  }
};

const removeFromBackend = sessionID => (dispatch) => {
  const url = `${URLS.REMOVE_SESSION}?sid=${sessionID}`;
  loadJSON(url).then(
    (data) => {
      dispatch(deleteSuccess());
      dispatch(displaySystemMessage(`Deleted session ${data.name}!`, MESSAGE_STATUS.SUCCESS));
      dispatch(setAvailableUserSessions(data.userSessions));
      dispatch(setAvailableDemoSessions(data.demoSessions));
    },
    (data) => {
      const message = (data && data.msg) || 'Unknown error';
      dispatch(displaySystemMessage(
        `Error removing session: ${message}`, MESSAGE_STATUS.ERROR));
    }
  );
};

const removeFromLocalStorage = sessionID => (dispatch) => {
  const existingSessions = localStorage.getItem(SAVED_SESSIONS_LOCAL_STORAGE_KEY);
  let filteredSessions = [];
  if (existingSessions) {
    filteredSessions = JSON.parse(existingSessions).filter(session => session.id !== sessionID);
  }
  localStorage.setItem(SAVED_SESSIONS_LOCAL_STORAGE_KEY, JSON.stringify(filteredSessions));
  dispatch(deleteSuccess());
  dispatch(displaySystemMessage('Deleted session!', MESSAGE_STATUS.SUCCESS));
  dispatch(getAvailableSessionsLocalStorage());
};

export const removeSession = sessionID => (dispatch, getStore) => {
  const currentState = getStore();
  if (currentState.login.isEndUserAuthSupported) {
    dispatch(removeFromBackend(sessionID));
  } else {
    dispatch(removeFromLocalStorage(sessionID));
  }
};
