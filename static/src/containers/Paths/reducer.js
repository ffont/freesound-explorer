import { ADD_PATH, SET_PATH_SYNC, PLAY_PATH, STOP_PATH, REMOVE_PATH,
  SET_PATH_SOUND_CURRENTLY_PLAYING, SELECT_PATH, DELETE_SOUND_FROM_PATH,
  ADD_SOUND_TO_PATH, CLEAR_ALL_PATHS, TOGGLE_WAIT_UNTIL_FINISHED,
  SET_PATH_ACTIVE } from './actions';
import { REMOVE_SOUND } from '../Sounds/actions';
import sessions from '../Sessions/reducer';
import { computePathname } from './utils';

export const initialState = { paths: [], selectedPath: '' };

export const pathInitialState = {
  id: undefined,
  name: undefined,
  isActive: true,
  isPlaying: false,
  syncMode: 'beat',
  waitUntilFinished: true,
  soundCurrentlyPlaying: {
    soundIdx: undefined,
    willFinishAt: undefined,
  },
  sounds: [],
};

export const path = (state = {}, action) => {
  if (action.pathID && state.id !== action.pathID) {
    return state;
  }
  // if you get here, you are the lucky path the action is referring to ;)
  switch (action.type) {
    case SET_PATH_SYNC: {
      return Object.assign({}, state, { syncMode: action.syncMode });
    }
    case PLAY_PATH:
    case STOP_PATH: {
      const isPlaying = action.type === PLAY_PATH;
      const soundCurrentlyPlaying = (isPlaying) ? state.soundCurrentlyPlaying : {
        soundIdx: undefined,
        willFinishAt: undefined,
      };
      return Object.assign({}, state, { isPlaying, soundCurrentlyPlaying });
    }
    case SET_PATH_SOUND_CURRENTLY_PLAYING: {
      return Object.assign({}, state, {
        soundCurrentlyPlaying: {
          soundIdx: action.soundIdx,
          willFinishAt: action.willFinishAt,
        },
      });
    }
    case SET_PATH_ACTIVE: {
      return Object.assign({}, state, { isActive: action.isActive });
    }
    case REMOVE_SOUND:
    case DELETE_SOUND_FROM_PATH: {
      return Object.assign({}, state, {
        sounds: state.sounds.filter(id => id !== action.soundID),
      });
    }
    case ADD_SOUND_TO_PATH: {
      return Object.assign({}, state, { sounds: [...state.sounds, action.soundID] });
    }
    case TOGGLE_WAIT_UNTIL_FINISHED: {
      return Object.assign({}, state, { waitUntilFinished: !state.waitUntilFinished });
    }
    default:
      return state;
  }
};

export const pathsReducer = (state = initialState.paths, action) => {
  switch (action.type) {
    case ADD_PATH: {
      const { pathID, sounds } = action;
      const pathName = computePathname(state);
      const newPath = Object.assign({}, pathInitialState, {
        sounds,
        id: pathID,
        name: pathName,
      });
      return [...state, newPath];
    }
    case SET_PATH_SYNC:
    case PLAY_PATH:
    case STOP_PATH:
    case SET_PATH_SOUND_CURRENTLY_PLAYING:
    case SET_PATH_ACTIVE:
    case REMOVE_SOUND:
    case DELETE_SOUND_FROM_PATH:
    case ADD_SOUND_TO_PATH:
    case TOGGLE_WAIT_UNTIL_FINISHED: {
      return state.map(curPath => path(curPath, action));
    }
    case CLEAR_ALL_PATHS: {
      return [];
    }
    case REMOVE_PATH: {
      return state.filter(curPath => curPath.id !== action.pathID);
    }
    default:
      return state;
  }
};

export const selectedPath = (state = initialState.selectedPath, action) => {
  switch (action.type) {
    case ADD_PATH: {
      return action.pathID;
    }
    case SELECT_PATH: {
      return action.pathID;
    }
    case REMOVE_PATH: {
      if (state === action.pathID) {
        return '';
      }
      return state;
    }
    case CLEAR_ALL_PATHS: {
      return '';
    }
    default:
      return state;
  }
};

// don't use combineReducers, we want reducer name to stay 'paths' (see sessions reducer)
const paths = (state = initialState, action) => ({
  paths: pathsReducer(state.paths, action),
  selectedPath: selectedPath(state.selectedPath, action),
});

export default sessions(paths);
