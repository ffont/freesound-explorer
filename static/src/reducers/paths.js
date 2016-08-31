import { default as UUID } from 'node-uuid';
import { indexElementWithId } from '../utils/arrayUtils';
import { ADD_PATH, SET_PATH_SYNC, STARTSTOP_PATH,
  SET_PATH_CURRENTLY_PLAYING, SELECT_PATH, DELETE_SOUND_FROM_PATH,
  ADD_SOUND_TO_PATH, CLEAR_ALL_PATHS, SET_PATH_WAIT_UNTIL_FINISHED } from '../actions/actionTypes';

const initialState = {
  paths: [],
  selectedPath: undefined,
};

export default function paths(state = initialState, action) {
  switch (action.type) {
    case ADD_PATH: {
      const pathId = UUID.v4();
      let pathName = String.fromCharCode(65 + (state.paths.length % 26));
      if (Math.floor(state.paths.length / 26) > 0) {
        pathName += 1 + Math.floor(state.paths.length / 26);
      }
      return Object.assign({}, state, {
        selectedPath: pathId,
        paths: [
          ...state.paths,
          {
            id: pathId,
            name: pathName,
            isPlaying: false,
            syncMode: 'beat',
            waitUntilFinished: true,
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
      const pathIdx = indexElementWithId(state.paths, action.pathId);
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        syncMode: action.syncMode,
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, pathIdx),
          updatedPath,
          ...state.paths.slice(pathIdx + 1),
        ],
      });
    }
    case STARTSTOP_PATH: {
      const pathIdx = indexElementWithId(state.paths, action.pathId);
      let newCurrentlyPlaying = state.paths[pathIdx].currentlyPlaying;
      if (!action.isPlaying) {
        newCurrentlyPlaying = {
          soundIdx: undefined,
          willFinishAt: undefined,
        };
      }
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        isPlaying: action.isPlaying,
        currentlyPlaying: newCurrentlyPlaying,
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, pathIdx),
          updatedPath,
          ...state.paths.slice(pathIdx + 1),
        ],
      });
    }
    case SET_PATH_CURRENTLY_PLAYING: {
      const pathIdx = indexElementWithId(state.paths, action.pathId);
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        currentlyPlaying: {
          soundIdx: action.soundIdx,
          willFinishAt: action.willFinishAt,
        },
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, pathIdx),
          updatedPath,
          ...state.paths.slice(pathIdx + 1),
        ],
      });
    }
    case SELECT_PATH: {
      // If selected pathId is already selected, unselect it
      return Object.assign({}, state, {
        selectedPath: (action.pathId === state.selectedPath) ? undefined : action.pathId,
      });
    }
    case DELETE_SOUND_FROM_PATH: {
      const pathIdx = indexElementWithId(state.paths, action.pathId);
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        sounds: [
          ...state.paths[pathIdx].sounds.slice(0, action.pathSoundIdx),
          ...state.paths[pathIdx].sounds.slice(action.pathSoundIdx + 1),
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
    case ADD_SOUND_TO_PATH: {
      const pathIdx = (action.pathId) ?
        indexElementWithId(state.paths, action.pathId) : state.selectedPath;
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        sounds: [
          ...state.paths[pathIdx].sounds,
          action.soundId,
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
    case SET_PATH_WAIT_UNTIL_FINISHED: {
      const pathIdx = indexElementWithId(state.paths, action.pathId);
      const updatedPath = Object.assign({}, state.paths[pathIdx], {
        waitUntilFinished: action.waitUntilFinished,
      });
      return Object.assign({}, state, {
        paths: [
          ...state.paths.slice(0, pathIdx),
          updatedPath,
          ...state.paths.slice(pathIdx + 1),
        ],
      });
    }
    default:
      return state;
  }
}
