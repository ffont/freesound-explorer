import { ADD_PATH, SET_PATH_SYNC, STARTSTOP_PATH,
  SET_PATH_CURRENTLY_PLAYING } from '../actions/actionTypes';

const initialState = {
  paths: [],
};

export default function paths(state = initialState, action) {
  switch (action.type) {
    case ADD_PATH: {
      return Object.assign({}, state, {
        paths: [
          ...state.paths,
          {
            name: `Path ${state.paths.length + 1}`,
            isPlaying: false,
            isSelected: false,
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
        isSelected: action.isPlaying,  // Set paths as selected when play
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
    default:
      return state;
  }
}
