import { FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_SUCCESS, FETCH_SOUNDS_FAILURE,
  UPDATE_MAP_POSITION, REMOVE_SPACE }
  from '../actions/actionTypes';
import { computeSoundGlobalPosition } from './sounds';
import { getMapCenter } from '../utils/uiUtils';
import sessions from './sessions';

const computeSpacePosition = (spaceIndex) => ({
  x: (spaceIndex * 4) + 1,
  y: 1,
});

const computeSpacePositionInMap = (spacePosition, mapPosition) => {
  const tsnePosition = { x: 0, y: 0 };
  const { cx, cy } = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
  return {
    x: cx,
    y: cy,
  };
};

const spaceInitialState = {
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

const singleSpace = (state = spaceInitialState, action, spacesInMap) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      const spacePosition = computeSpacePosition(spacesInMap);
      const { query, queryParams, queryID } = action;
      return Object.assign({}, state, {
        query,
        queryParams,
        queryID,
        position: spacePosition,
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

const spacesReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      const spacesInMap = state.length;
      const space = singleSpace(spaceInitialState, action, spacesInMap);
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

const getSpaceDistanceToCenter = (space, center) =>
  Math.sqrt(Math.pow((space.currentPositionInMap.x - center.x), 2) +
    Math.pow((space.currentPositionInMap.y - center.y), 2));

const getClosestSpaceToCenter = (allSpaces) => {
  let minDistance = Infinity;
  const mapCenter = getMapCenter();
  return allSpaces.reduce((curState, curSpace) => {
    const distanceToCenter = getSpaceDistanceToCenter(curSpace, mapCenter);
    if (distanceToCenter < minDistance) {
      minDistance = distanceToCenter;
      return curSpace;
    }
    return curState;
  }, undefined);
};

const currentSpace = (state = '', action, allSpaces) => {
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
