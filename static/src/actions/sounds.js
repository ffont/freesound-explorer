import { displaySystemMessage } from './messagesBox';
import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';
import { submitQuery, reshapeReceivedSounds } from '../utils/fsQuery';
import { MESSAGE_STATUS } from '../constants';

const fetchRequest = makeActionCreator(at.FETCH_SOUNDS_REQUEST, 'query', 'queryParams');
const fetchSuccess = makeActionCreator(at.FETCH_SOUNDS_SUCCESS, 'sounds', 'query', 'queryParams');
const fetchFailure = makeActionCreator(at.FETCH_SOUNDS_FAILURE, 'error', 'query', 'queryParams');

export const getSounds = (query, maxResults, maxDuration, minDuration = 0) => (dispatch) => {
  dispatch(displaySystemMessage('Searching for sounds...'));
  const queryParams = { maxResults, maxDuration, minDuration };
  dispatch(fetchRequest(query, queryParams));
  submitQuery(query, maxResults, maxDuration).then(
    allPagesResults => {
      const sounds = reshapeReceivedSounds(allPagesResults);
      dispatch(displaySystemMessage(`${sounds.length} sounds loaded, computing map`));
      dispatch(fetchSuccess(sounds, query, queryParams));
    },
    error => {
      dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
      dispatch(fetchFailure(error, query, queryParams));
    }
  );
};
