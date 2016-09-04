import { NEW_SESSION, LOAD_SESSION } from './actionTypes';
import makeActionCreator from './makeActionCreator';
import { reducersToExport } from '../reducers/sessions';
import { removeSoundBuffers } from '../utils/audioLoader';

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
