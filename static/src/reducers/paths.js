import { ADD_PATH, SET_PATH_SYNC } from '../actions/actionTypes';

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
    default:
      return state;
  }
}
