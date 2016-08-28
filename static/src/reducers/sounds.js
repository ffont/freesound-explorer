import { combineReducers } from 'redux';
import { sidebarWidth, sidebarClosedOffset, sidebarContentPadding, thumbnailHeight }
  from 'json!../stylesheets/variables.json';
import { FETCH_SOUNDS_SUCCESS, UPDATE_SOUNDS_POSITION, UPDATE_MAP_POSITION,
  SELECT_SOUND_BY_ID, GET_SOUND_BUFFER, TOGGLE_HOVERING_SOUND, PLAY_AUDIO_SRC,
  STOP_AUDIO_SRC, MAP_COMPUTATION_COMPLETE }
  from '../actions/actionTypes';
import { MAP_SCALE_FACTOR } from '../constants';

const thumbnailSize = {
  width: parseInt(sidebarWidth, 10) - parseInt(sidebarClosedOffset, 10) -
    (2 * (parseInt(sidebarContentPadding, 10))),
  height: parseInt(thumbnailHeight, 10),
};

export const computeSoundGlobalPosition =
  (tsnePosition, spacePosition, mapPosition, isThumbnail = false) => {
    const windowWidth = (isThumbnail) ? thumbnailSize.width : window.innerWidth;
    const windowHeight = (isThumbnail) ? thumbnailSize.height : window.innerHeight;
    const { translateX, translateY, scale } = mapPosition;
    const cx = ((tsnePosition.x + (windowWidth / (MAP_SCALE_FACTOR * 2))) *
      MAP_SCALE_FACTOR * scale * spacePosition.x) + translateX;
    const cy = ((tsnePosition.y + (windowHeight / (MAP_SCALE_FACTOR * 2))) *
      MAP_SCALE_FACTOR * scale * spacePosition.y) + translateY;
    return { cx, cy };
  };

const sound = (state, action) => {
  const soundID = state.id;
  switch (action.type) {
    case UPDATE_SOUNDS_POSITION: {
      if (!action.sounds[soundID]) {
        return state;
      }
      return Object.assign({}, state, action.sounds[soundID]);
    }
    case UPDATE_MAP_POSITION: {
      const mapPosition = action.position;
      const { tsnePosition, spacePosition } = state;
      return Object.assign({}, state, {
        position: computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition),
      });
    }
    case MAP_COMPUTATION_COMPLETE: {
      if (action.queryID !== state.queryID) {
        return state;
      }
      const mapPosition = { translateX: 0, translateY: 0, scale: 0.30 };
      const spacePosition = { x: 1, y: 1 };
      const { tsnePosition } = state;
      const isThumbnail = true;
      const thumbnailPosition =
        computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition, isThumbnail);
      return Object.assign({}, state, { thumbnailPosition });
    }
    default:
      return state;
  }
};

const byID = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_SUCCESS: {
      return Object.assign({}, state, action.sounds);
    }
    case UPDATE_SOUNDS_POSITION:
    case MAP_COMPUTATION_COMPLETE:
    case UPDATE_MAP_POSITION: {
      const updatedSounds = Object.keys(state).reduce((curState, curSoundID) =>
        Object.assign({}, curState, { [curSoundID]: sound(state[curSoundID], action) }), {});
      return Object.assign({}, state, updatedSounds);
    }
    case GET_SOUND_BUFFER: {
      const { soundID, buffer } = action;
      const updatedSound = { [soundID]: Object.assign({}, state[soundID], { buffer }) };
      return Object.assign({}, state, updatedSound);
    }
    case TOGGLE_HOVERING_SOUND: {
      const { soundID } = action;
      const updatedSound = { [soundID]: Object.assign({}, state[soundID], {
        isHovered: !state[soundID].isHovered,
      }) };
      return Object.assign({}, state, updatedSound);
    }
    case PLAY_AUDIO_SRC:
    case STOP_AUDIO_SRC: {
      const { soundID } = action;
      const isPlaying = action.type === PLAY_AUDIO_SRC;
      const updatedSound = { [soundID]: Object.assign({}, state[soundID], {
        isPlaying,
      }) };
      return Object.assign({}, state, updatedSound);
    }
    default:
      return state;
  }
};

const selectedSound = (state = 0, action) => {
  switch (action.type) {
    case SELECT_SOUND_BY_ID:
      return action.soundID || 0;
    default:
      return state;
  }
};

export default combineReducers({ byID, selectedSound });
