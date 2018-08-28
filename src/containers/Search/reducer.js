import { DEFAULT_MAX_DURATION, DEFAULT_DESCRIPTOR, DEFAULT_MAX_RESULTS,
  DEFAULT_MIN_DURATION, DEFAULT_SORTING }
  from 'constants';
import { UPDATE_SORTING, UPDATE_DESCRIPTOR, UPDATE_MAX_RESULTS, UPDATE_MIN_DURATION,
  UPDATE_MAX_DURATION, UPDATE_QUERY }
  from './actions';
import { FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_FAILURE, MAP_COMPUTATION_COMPLETE }
  from '../Sounds/actions';
import { REMOVE_SPACE } from '../Spaces/actions';

export const initialState = {
  query: '',
  isSearchEnabled: false,
  activeSearches: [],
  maxResults: DEFAULT_MAX_RESULTS,
  minDuration: DEFAULT_MIN_DURATION,
  maxDuration: DEFAULT_MAX_DURATION,
  descriptor: DEFAULT_DESCRIPTOR,
  sorting: DEFAULT_SORTING,
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DESCRIPTOR: {
      return Object.assign({}, state, {
        descriptor: action.descriptor,
      });
    }
    case UPDATE_SORTING: {
      return Object.assign({}, state, {
        sorting: action.sorting,
      });
    }
    case UPDATE_MAX_RESULTS: {
      return Object.assign({}, state, {
        maxResults: parseInt(action.maxResults, 10),
      });
    }
    case UPDATE_MIN_DURATION: {
      return Object.assign({}, state, {
        minDuration: Number(action.minDuration),
      });
    }
    case UPDATE_MAX_DURATION: {
      return Object.assign({}, state, {
        maxDuration: Number(action.maxDuration),
      });
    }
    case UPDATE_QUERY: {
      return Object.assign({}, state, {
        query: action.query,
      });
    }
    case REMOVE_SPACE:
    case FETCH_SOUNDS_REQUEST:
    case FETCH_SOUNDS_FAILURE:
    case MAP_COMPUTATION_COMPLETE: {
      let activeSearches = [];
      // copy active searches squentially to avoid testing issues
      state.activeSearches.forEach(e => activeSearches.push(e));
      // delete failed or finished searches
      if (action.type !== FETCH_SOUNDS_REQUEST) {
        activeSearches = activeSearches.filter((a) => a !== action.queryID);
      } else {
        // add new request
        activeSearches.push(action.queryID);
      }
      // search is enabled as long as there is any active one.
      const isSearchEnabled = activeSearches.length !== 0;
      return Object.assign({}, state, { activeSearches, isSearchEnabled });
    }
    default:
      return state;
  }
};

export default search;
