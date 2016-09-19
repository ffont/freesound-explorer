import makeActionCreator from '../../utils/makeActionCreator';
import { reducersToExport } from './reducer';
import { removeSoundBuffers } from '../Audio/utils';

export const NEW_SESSION = 'NEW_SESSION';
export const SAVE_SESSION = 'SAVE_SESSION';
export const LOAD_SESSION = 'LOAD_SESSION';

export const newSession = makeActionCreator(NEW_SESSION);

const filterDataToExport = (dataToSave) =>
  Object.keys(dataToSave).reduce((curState, curReducer) => {
    if (curReducer !== 'sounds') {
      return Object.assign(curState, { [curReducer]: dataToSave[curReducer] });
    }
    const soundsData = Object.assign({}, dataToSave.sounds, {
      byID: removeSoundBuffers(dataToSave.sounds.byID),
    });
    return Object.assign(curState, { sounds: soundsData });
  }, {});

export const saveSession = () => (dispatch, getStore) => {
  const currentState = getStore();
  const dataToSave = reducersToExport.reduce((exportedState, curReducer) =>
    Object.assign(exportedState, { [curReducer]: currentState[curReducer] }), {});
  const filteredData = filterDataToExport(dataToSave);
  const downloadableData = JSON.stringify(filteredData);
};

export const loadSession = () => {

};
