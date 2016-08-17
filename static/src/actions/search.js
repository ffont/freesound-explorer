import makeActionCreator from './makeActionCreator';
import { UPDATE_MIN_DURATION, UPDATE_MAX_RESULTS, UPDATE_MAX_DURATION,
  UPDATE_DESCRIPTOR, UPDATE_QUERY } from './actionTypes';

export const updateMinDuration = makeActionCreator(UPDATE_MIN_DURATION, 'minDuration');
export const updateMaxDuration = makeActionCreator(UPDATE_MAX_DURATION, 'maxDuration');
export const updateMaxResults = makeActionCreator(UPDATE_MAX_RESULTS, 'maxResults');
export const updateDescriptor = makeActionCreator(UPDATE_DESCRIPTOR, 'descriptor');
export const updateQuery = makeActionCreator(UPDATE_QUERY, 'query');
