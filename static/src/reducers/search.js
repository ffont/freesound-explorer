import { DEFAULT_MAX_DURATION, DEFAULT_DESCRIPTOR, DEFAULT_MAX_RESULTS,
  DEFAULT_MIN_DURATION }
  from '../constants';
import { UPDATE_DESCRIPTOR, UPDATE_MAX_RESULTS, UPDATE_MIN_DURATION,
  UPDATE_MAX_DURATION, UPDATE_QUERY }
  from '../actions/actionTypes';

export const initialState = {
  query: '',
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
        minDuration: parseInt(action.minDuration, 10),
      });
    }
    case UPDATE_MAX_DURATION: {
      return Object.assign({}, state, {
        maxDuration: parseInt(action.maxDuration, 10),
      });
    }
    case UPDATE_QUERY: {
      return Object.assign({}, state, {
        query: action.query,
      });
    }
    default:
      return state;
  }
};

export default search;
