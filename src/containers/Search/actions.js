import makeActionCreator from 'utils/makeActionCreator';

export const UPDATE_MAX_RESULTS = 'UPDATE_MAX_RESULTS';
export const UPDATE_MAX_DURATION = 'UPDATE_MAX_DURATION';
export const UPDATE_MIN_DURATION = 'UPDATE_MIN_DURATION';
export const UPDATE_DESCRIPTOR = 'UPDATE_DESCRIPTOR';
export const UPDATE_QUERY = 'UPDATE_QUERY';

export const updateMinDuration = makeActionCreator(UPDATE_MIN_DURATION, 'minDuration');
export const updateMaxDuration = makeActionCreator(UPDATE_MAX_DURATION, 'maxDuration');
export const updateMaxResults = makeActionCreator(UPDATE_MAX_RESULTS, 'maxResults');
export const updateDescriptor = makeActionCreator(UPDATE_DESCRIPTOR, 'descriptor');
export const updateQuery = makeActionCreator(UPDATE_QUERY, 'query');
