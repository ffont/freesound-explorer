import { displaySystemMessage } from './messagesBox';
import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';
import { submitQuery, reshapeReceivedSounds } from '../utils/fsQuery';
import { MESSAGE_STATUS, TSNE_CONFIG, DEFAULT_DESCRIPTOR, MAX_TSNE_ITERATIONS }
  from '../constants';
import { readObjectByString } from '../utils/misc';
import tsnejs from '../vendors/tsne';
import '../polyfills/requestAnimationFrame';

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

let clearTimeoutId;
let stepIteration = 0;
let progress = 0;

const computePointsPositionInSolution = (tsne, sounds) => {
  const tsneSolution = tsne.getSolution();
  return sounds.map((sound, index) =>
    Object.assign(sound, {
      x: tsneSolution[index][0],
      y: tsneSolution[index][1],
    }));
};

const computeStepSolution = (tsne, sounds, dispatch) => {
  if (stepIteration <= MAX_TSNE_ITERATIONS) {
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
      dispatch(displaySystemMessage(statusMessage));
    }
    const soundsWithUpdatedPosition = computePointsPositionInSolution(tsne, sounds);
    dispatch(updateSoundsPosition(soundsWithUpdatedPosition, '', ''));
    clearTimeoutId = requestAnimationFrame(() =>
      computeStepSolution(tsne, soundsWithUpdatedPosition, dispatch));
  } else {
    cancelAnimationFrame(clearTimeoutId);
    stepIteration = 0;
    progress = 0;
    dispatch(displaySystemMessage('Map computed!', MESSAGE_STATUS.SUCCESS));
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
      dispatch(fetchSuccess(sounds, query, queryParams));
      dispatch(displaySystemMessage(`${sounds.length} sounds loaded, computing map`));
      const tsne = trainTsne(sounds, queryParams);
      computeStepSolution(tsne, sounds, dispatch);
    },
    error => {
      dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
      dispatch(fetchFailure(error, query, queryParams));
    }
  );
};

export const selectSound = makeActionCreator(at.SELECT_SOUND_BY_ID, 'soundID');
