import makeActionCreator from '../../utils/makeActionCreator';
import { getDataToSave } from './utils';
import { displaySystemMessage } from '../MessagesBox/actions';
import { MESSAGE_STATUS } from '../../constants';
import { loadJSON } from '../../utils/requests';

export const NEW_SESSION = 'NEW_SESSION';
export const SAVE_SESSION = 'SAVE_SESSION';
export const LOAD_SESSION = 'LOAD_SESSION';
export const BACKEND_SAVE_REQUEST = 'BACKEND_SAVE_REQUEST';
export const BACKEND_SAVE_SUCCESS = 'BACKEND_SAVE_SUCCESS';
export const BACKEND_SAVE_FAILURE = 'BACKEND_SAVE_FAILURE';

const URLS = {
  save: '/save/',
  load: '/load/',
};

// no need to exports all these actions as they will be used internally in saveSession
const backendSaveRequest = makeActionCreator(BACKEND_SAVE_REQUEST, 'sessionID', 'dataToSave');
const backendSaveSuccess = makeActionCreator(BACKEND_SAVE_SUCCESS, 'sessionID');
const backendSaveFailure = makeActionCreator(BACKEND_SAVE_FAILURE, 'msg');

export const newSession = makeActionCreator(NEW_SESSION);

export const saveSession = (sessionID = undefined) => (dispatch, getStore) => {
  const currentState = getStore();
  const dataToSave = getDataToSave(currentState);

  // Save to backend
  let url = URLS.save;
  if (sessionID) {
    url = `${url}?sid=${sessionID}`;
  }
  dispatch(backendSaveRequest(sessionID, dataToSave));
  loadJSON(url, dataToSave).then(
    (data) => {
      dispatch(backendSaveSuccess(data.sessionID));
      dispatch(displaySystemMessage(
        `Session successfully saved! (${data.sessionID})`, MESSAGE_STATUS.SUCCESS));
    },
    (data) => {
      const message = (data && data.msg) || 'Unknown error';
      dispatch(backendSaveFailure(message));
      dispatch(displaySystemMessage(
        `Could not save the session: ${message}`, MESSAGE_STATUS.ERROR));
    }
  );
};

export const loadSession = () => {

};
