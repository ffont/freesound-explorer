import { REMOVE_SPACE } from './actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';
import { FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_SUCCESS, FETCH_SOUNDS_FAILURE }
  from '../Sounds/actions';
import { computeSpacePosition, computeSpacePositionInMap, computeSpaceIndex,
  getClosestSpaceToCenter } from './utils';
import sessions from '../Sessions/reducer';

export const spaceInitialState = {
  sounds: [],
  query: undefined,
  queryParams: {
    maxResults: undefined,
    minDuration: undefined,
    maxDuration: undefined,
    descriptor: undefined,
  },
  queryID: undefined,
  position: {
    x: 0,
    y: 0,
  },
  currentPositionInMap: {
    x: 0,
    y: 0,
  },
};

export const singleSpace = (state = spaceInitialState, action, spaceIndex) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      const spacePosition = computeSpacePosition(spaceIndex);
      const { query, queryParams, queryID } = action;
      return Object.assign({}, state, {
        position: spacePosition,
        query,
        queryParams,
        queryID,
        spaceIndex,
      });
    }
    case FETCH_SOUNDS_SUCCESS: {
      const { queryID, sounds, mapPosition } = action;
      if (queryID !== state.queryID) {
        return state;
      }
      const currentPositionInMap = computeSpacePositionInMap(state.position, mapPosition);
      return Object.assign({}, state, {
        sounds: Object.keys(sounds),
        currentPositionInMap,
      });
    }
    case UPDATE_MAP_POSITION: {
      const spacePosition = state.position;
      const mapPosition = action.position;
      const currentPositionInMap = computeSpacePositionInMap(spacePosition, mapPosition);
      return Object.assign({}, state, { currentPositionInMap });
    }
    default:
      return state;
  }
};

export const spacesReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      const spaceIndex = computeSpaceIndex(state);
      const space = singleSpace(spaceInitialState, action, spaceIndex);
      return [...state, space];
    }
    case FETCH_SOUNDS_SUCCESS:
    case UPDATE_MAP_POSITION: {
      return state.map(space => singleSpace(space, action));
    }
    case FETCH_SOUNDS_FAILURE:
    case REMOVE_SPACE: {
      return state.filter(space => space.queryID !== action.queryID);
    }
    default:
      return state;
  }
};

export const currentSpace = (state = '', action, allSpaces) => {
  switch (action.type) {
    case FETCH_SOUNDS_SUCCESS:
      return action.queryID;
    case UPDATE_MAP_POSITION: {
      const closestSpace = getClosestSpaceToCenter(allSpaces);
      if (closestSpace) {
        return closestSpace.queryID;
      }
      return state;
    }
    default:
      return state;
  }
};

const spaces = (state = {}, action) => ({
  spaces: spacesReducer(state.spaces, action),
  currentSpace: currentSpace(state.currentSpace, action, state.spaces),
});
export default sessions(spaces);
