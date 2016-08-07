import { ADD_PATH, SET_PATH_SYNC, STARTSTOP_PATH,
  SET_PATH_CURRENTLY_PLAYING, SELECT_PATH, DELETE_SOUND_FROM_PATH,
  ADD_SOUND_TO_PATH, CLEAR_ALL_PATHS } from '../actions/actionTypes';

const initialState = {
  paths: [],
  selectedPath: undefined,
};

export default function paths(state = initialState, action) {
  switch (action.type) {
    case ADD_PATH: {
      return Object.assign({}, state, {
        selectedPath: state.paths.length,
        paths: [
          ...state.paths,
          {
            name: `Path ${state.paths.length + 1}`,
            isPlaying: false,
            syncMode: 'beat',
            currentlyPlaying: {
              soundIdx: undefined,
              willFinishAt: undefined,
            },
            sounds: action.sounds,
          },
        ],
      });
    }
    case SET_PATH_SYNC: {
      const updatedPath = Object.assign({}, state.paths[action.pathIdx], {
        syncMode: action.syncMode,
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, action.pathIdx),
          updatedPath,
          ...state.paths.slice(action.pathIdx + 1),
        ],
      });
    }
    case STARTSTOP_PATH: {
      let newCurrentlyPlaying = state.paths[action.pathIdx].currentlyPlaying;
      if (!action.isPlaying) {
        newCurrentlyPlaying = {
          soundIdx: undefined,
          willFinishAt: undefined,
        };
      }
      const updatedPath = Object.assign({}, state.paths[action.pathIdx], {
        isPlaying: action.isPlaying,
        currentlyPlaying: newCurrentlyPlaying,
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, action.pathIdx),
          updatedPath,
          ...state.paths.slice(action.pathIdx + 1),
        ],
      });
    }
    case SET_PATH_CURRENTLY_PLAYING: {
      const updatedPath = Object.assign({}, state.paths[action.pathIdx], {
        currentlyPlaying: {
          soundIdx: action.soundIdx,
          willFinishAt: action.willFinishAt,
        },
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, action.pathIdx),
          updatedPath,
          ...state.paths.slice(action.pathIdx + 1),
        ],
      });
    }
    case SELECT_PATH: {
      return Object.assign({}, state, {
        selectedPath: action.pathIdx,
      });
    }
    case DELETE_SOUND_FROM_PATH: {
      const updatedPath = Object.assign({}, state.paths[action.pathIdx], {
        sounds: [
          ...state.paths[action.pathIdx].sounds.slice(0, action.pathSoundIdx),
          ...state.paths[action.pathIdx].sounds.slice(action.pathSoundIdx + 1),
        ],
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, action.pathIdx),
          updatedPath,
          ...state.paths.slice(action.pathIdx + 1),
        ],
      });
    }
    case ADD_SOUND_TO_PATH: {
      const pathIdx = (action.pathIdx) ? action.pathIdx : state.selectedPath;
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        sounds: [
          ...state.paths[pathIdx].sounds,
          action.sound,
        ],
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, pathIdx),
          updatedPath,
          ...state.paths.slice(pathIdx + 1),
        ],
      });
    }
    case CLEAR_ALL_PATHS: {
      return initialState;
    }
    default:
      return state;
  }
}
