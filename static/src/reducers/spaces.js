import { FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_SUCCESS, FETCH_SOUNDS_FAILURE }
  from '../actions/actionTypes';

export const computeSpacePosition = (spaceIndex) => ({ x: 0, y: 0 });

export const spaceInitialState = {
  sounds: [],
  isFetching: true,
  query: undefined,
  queryParams: {
    maxResults: undefined,
    minDuration: undefined,
    maxDuration: undefined,
    descriptor: undefined,
  },
  queryID: undefined,
  error: undefined,
  position: {
    x: 0,
    y: 0,
  },
};

export const singleSpace = (state = spaceInitialState, action, spacesInMap) => {
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
      const { queryID, sounds } = action;
      if (queryID !== state.queryID) {
        return state;
      }
      return Object.assign({}, state, {
        isFetching: false,
        sounds: sounds.map(sound => sound.id),
      });
    }
    default:
      return state;
  }
};

export const initialState = [];

const spaces = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      const spacesInMap = state.length;
      const space = singleSpace(spaceInitialState, action, spacesInMap);
      return [...state, space];
    }
    case FETCH_SOUNDS_SUCCESS: {
      return state.map(space => singleSpace(space, action));
    }
    case FETCH_SOUNDS_FAILURE: {
      // remove space from state if query failed
      return state.filter(space => space.queryID !== action.queryID);
    }
    default:
      return state;
  }
};

export default spaces;
