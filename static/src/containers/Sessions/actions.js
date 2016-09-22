import makeActionCreator from '../../utils/makeActionCreator';
import { getDataToSave } from './utils';

export const NEW_SESSION = 'NEW_SESSION';
export const SAVE_SESSION = 'SAVE_SESSION';
export const LOAD_SESSION = 'LOAD_SESSION';

export const newSession = makeActionCreator(NEW_SESSION);


export const saveSession = () => (dispatch, getStore) => {
  const currentState = getStore();
  const dataToSave = getDataToSave(currentState);
  console.log(dataToSave);
};

export const loadSession = () => {

};
