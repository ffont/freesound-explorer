import { REMOVE_SPACE, CLUSTERS_COMPUTED } from './actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';
import { REMOVE_SOUND, FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_SUCCESS,
  FETCH_SOUNDS_FAILURE } from '../Sounds/actions';
import { computeSoundGlobalPosition } from '../Sounds/utils';
import { computeSpacePosition, computeSpacePositionInMap, computeSpaceIndex,
  getClosestSpaceToCenter } from './utils';
import storable from '../SessionsHandler/storableReducer';

export const initialState = { spaces: [], currentSpace: '' };

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
  clusters: [],
};

export const singleCluster = (state, action, spacePosition) => {
  switch (action.type) {
    case UPDATE_MAP_POSITION: {
      const mapPosition = action.position;
      const clusterPosition = computeSoundGlobalPosition(state.centroid, spacePosition, mapPosition);
      return Object.assign({}, state, { clusterPosition });
    }
    default: {
      return state;
    }
  }
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
      let clusters = state.clusters;
      if (state.clusters.length > 0) {
        clusters = state.clusters.map(cluster => singleCluster(cluster, action, spacePosition));
      }
      return Object.assign({}, state, { currentPositionInMap, clusters });
    }
    case REMOVE_SOUND: {
      const { queryID, soundID } = action;
      if (queryID !== state.queryID) {
        return state;
      }
      return Object.assign({}, state, {
        sounds: state.sounds.filter(curSoundID => curSoundID !== soundID),
      });
    }
    case CLUSTERS_COMPUTED: {
      const { queryID, clusters } = action;
      if (state.queryID === queryID) {
        return Object.assign({}, state, { clusters });
      }
      return state;
    }
    default:
      return state;
  }
};

export const spacesReducer = (state = initialState.spaces, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      const spaceIndex = computeSpaceIndex(state);
      const space = singleSpace(spaceInitialState, action, spaceIndex);
      return [...state, space];
    }
    case REMOVE_SOUND:
    case FETCH_SOUNDS_SUCCESS:
    case UPDATE_MAP_POSITION: {
      return state.map(space => singleSpace(space, action));
    }
    case FETCH_SOUNDS_FAILURE:
    case REMOVE_SPACE: {
      return state.filter(space => space.queryID !== action.queryID);
    }
    case CLUSTERS_COMPUTED: {
      return state.map(space => singleSpace(space, action));
    }
    default:
      return state;
  }
};

export const currentSpace = (state = initialState.currentSpace, action, allSpaces) => {
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

const spaces = (state = initialState, action) => ({
  spaces: spacesReducer(state.spaces, action),
  currentSpace: currentSpace(state.currentSpace, action, state.spaces),
});
export default storable(spaces);
