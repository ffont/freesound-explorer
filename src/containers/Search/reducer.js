import { DEFAULT_MAX_DURATION, DEFAULT_DESCRIPTOR, DEFAULT_MAX_RESULTS,
  DEFAULT_MIN_DURATION }
  from '../../constants';
import { UPDATE_DESCRIPTOR, UPDATE_MAX_RESULTS, UPDATE_MIN_DURATION,
  UPDATE_MAX_DURATION, UPDATE_QUERY }
  from './actions';
import { FETCH_SOUNDS_REQUEST, FETCH_SOUNDS_FAILURE, MAP_COMPUTATION_COMPLETE }
  from '../Sounds/actions';

export const initialState = {
  query: '',
  isSearchEnabled: true,
  maxResults: DEFAULT_MAX_RESULTS,
  minDuration: DEFAULT_MIN_DURATION,
  maxDuration: DEFAULT_MAX_DURATION,
  descriptor: DEFAULT_DESCRIPTOR,
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DESCRIPTOR: {
      return Object.assign({}, state, {
        descriptor: action.descriptor,
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
    case FETCH_SOUNDS_REQUEST:
    case FETCH_SOUNDS_FAILURE:
    case MAP_COMPUTATION_COMPLETE: {
      return Object.assign({}, state, {
        // disabled with every new query
        isSearchEnabled: action.type !== FETCH_SOUNDS_REQUEST,
      });
    }
    default:
      return state;
  }
};

export default search;
