import lodash from 'lodash';
import { displaySystemMessage } from './messagesBox';
import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';
import { submitQuery, reshapeReceivedSounds } from '../utils/fsQuery';
import { MESSAGE_STATUS, TSNE_CONFIG, DEFAULT_DESCRIPTOR, MAX_TSNE_ITERATIONS }
  from '../constants';
import { readObjectByString } from '../utils/misc';
import tsnejs from '../vendors/tsne';

const fetchRequest = makeActionCreator(at.FETCH_SOUNDS_REQUEST, 'query', 'queryParams');
const fetchSuccess = makeActionCreator(at.FETCH_SOUNDS_SUCCESS, 'sounds', 'query', 'queryParams');
const fetchFailure = makeActionCreator(at.FETCH_SOUNDS_FAILURE, 'error', 'query', 'queryParams');
const updateSoundsPosition = makeActionCreator(at.UPDATE_SOUNDS_POSITION, 'sounds',
  'query', 'queryParams');

const trainTsne = (sounds, queryParams) => {
  const tsne = new tsnejs.Tsne(TSNE_CONFIG);
  const descriptor = queryParams.descriptor || DEFAULT_DESCRIPTOR;
  const descriptorKey = `analysis.${descriptor}`;
  const trainingData = sounds.map(sound => readObjectByString(sound, descriptorKey));
  tsne.initDataRaw(trainingData);
  return tsne;
};

const computeTsneSolution = (tsne, sounds, dispatch) => {
  let progress = 0;
  let stepIteration = 0;
  const throttledDispatch = lodash.throttle(dispatch, 16);
  while (stepIteration <= MAX_TSNE_ITERATIONS) {
    // compute step solution
    tsne.step();
    stepIteration++;
    const computedProgress = stepIteration / MAX_TSNE_ITERATIONS;
    const computedProgressPercentage = parseInt(100 * computedProgress, 10);
    if (progress !== computedProgressPercentage) {
      // update status message only with new percentage
      progress = computedProgressPercentage;
      const statusMessage =
        `${sounds.length} sounds loaded, computing map (${progress}%)`;
      throttledDispatch(displaySystemMessage(statusMessage));
    }
    throttledDispatch(updateSoundsPosition(sounds, '', ''));
  }
};

/**
 * Function for calling FS and creating a map for the received sounds.
 *
 * @type {string} query: the query (e.g. 'instrument note')
 * @type {object} queryParams: the parameters of the query
 *       (descriptor, maxResults, maxDuration, minDuration)
 */
export const getSounds = (query, queryParams) => (dispatch) => {
  dispatch(displaySystemMessage('Searching for sounds...'));
  dispatch(fetchRequest(query, queryParams));
  const { maxResults, maxDuration } = queryParams;
  submitQuery(query, maxResults, maxDuration).then(
    allPagesResults => {
      const sounds = reshapeReceivedSounds(allPagesResults);
      dispatch(displaySystemMessage(`${sounds.length} sounds loaded, computing map`));
      const tsne = trainTsne(sounds, queryParams);
      computeTsneSolution(tsne, sounds, dispatch);
      dispatch(displaySystemMessage('Map computed!', MESSAGE_STATUS.SUCCESS));
      dispatch(fetchSuccess(sounds, query, queryParams));
    },
    error => {
      dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
      dispatch(fetchFailure(error, query, queryParams));
    }
  );
};

export const selectSound = makeActionCreator(at.SELECT_SOUND_BY_ID, 'soundID');
