import { combineReducers } from 'redux';
import { FETCH_SOUNDS_SUCCESS, UPDATE_SOUNDS_POSITION }
  from '../actions/actionTypes';

const mapSoundsToObject = (sounds, queryID) => sounds.reduce((curState, curSound) => {
  const soundObj = Object.assign({}, curSound, { queryID });
  return Object.assign({}, curState, { [curSound.id]: soundObj });
}, {});

const byID = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_SUCCESS: {
      const receivedSounds = mapSoundsToObject(action.sounds, action.queryID);
      return Object.assign({}, state, receivedSounds);
    }
    case UPDATE_SOUNDS_POSITION: {
      const updatedSounds = action.sounds;
      const stateSoundsToUpdate = updatedSounds.reduce((curState, sound) =>
        Object.assign(curState, {
          [sound.id]: sound,
        }), {});
      return Object.assign({}, state, stateSoundsToUpdate);
    }
    default:
      return state;
  }
};

const selectedSound = (state = 0, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({ byID, selectedSound });
