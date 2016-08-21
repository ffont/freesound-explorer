import { combineReducers } from 'redux';
import { FETCH_SOUNDS_SUCCESS, UPDATE_SOUNDS_POSITION, UPDATE_MAP_POSITION,
  SELECT_SOUND_BY_ID, GET_SOUND_BUFFER }
  from '../actions/actionTypes';
import { MAP_SCALE_FACTOR } from '../constants';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

export const computeSoundGlobalPosition = (tsnePosition, spacePosition, mapPosition) => {
  const { translateX, translateY, scale } = mapPosition;
  const cx = ((tsnePosition.x + (windowWidth / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.x) + translateX;
  const cy = ((tsnePosition.y + (windowHeight / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.y) + translateY;
  return { cx, cy };
};

const byID = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_SUCCESS: {
      return Object.assign({}, state, action.sounds);
    }
    case UPDATE_SOUNDS_POSITION: {
      const updatedSounds = Object.keys(action.sounds).reduce((curState, curSoundID) => {
        const sound = state[curSoundID];
        return Object.assign({}, curState, {
          [curSoundID]: Object.assign({}, sound, action.sounds[curSoundID]),
        });
      }, {});
      return Object.assign({}, state, updatedSounds);
    }
    case UPDATE_MAP_POSITION: {
      const mapPosition = action.position;
      const updatedSounds = Object.keys(state).reduce((curState, soundID) => {
        const sound = state[soundID];
        const { tsnePosition, spacePosition } = sound;
        const updateSound = Object.assign({}, sound, {
          position: computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition),
        });
        return Object.assign({}, curState, { [soundID]: updateSound });
      }, {});
      return Object.assign({}, state, updatedSounds);
    }
    case GET_SOUND_BUFFER: {
      const { soundID, buffer } = action;
      const updatedSound = { [soundID]: Object.assign({}, state[soundID], { buffer }) };
      return Object.assign({}, state, updatedSound);
    }
    default:
      return state;
  }
};

const selectedSound = (state = 0, action) => {
  switch (action.type) {
    case SELECT_SOUND_BY_ID:
      return action.soundID;
    default:
      return state;
  }
};

export default combineReducers({ byID, selectedSound });
