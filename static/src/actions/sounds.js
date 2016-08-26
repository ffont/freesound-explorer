import { default as UUID } from 'node-uuid';
import { displaySystemMessage } from './messagesBox';
import makeActionCreator from './makeActionCreator';
import * as at from './actionTypes';
import { submitQuery, reshapeReceivedSounds } from '../utils/fsQuery';
import { MESSAGE_STATUS, TSNE_CONFIG, DEFAULT_DESCRIPTOR, MAX_TSNE_ITERATIONS }
  from '../constants';
import { readObjectByString } from '../utils/misc';
import { computeSoundGlobalPosition } from '../reducers/sounds';
import tsnejs from '../vendors/tsne';
import '../polyfills/requestAnimationFrame';

// no need to exports all these actions as they will be used internally in getSounds
const fetchRequest = makeActionCreator(at.FETCH_SOUNDS_REQUEST, 'queryID', 'query', 'queryParams');
const fetchSuccess = makeActionCreator(at.FETCH_SOUNDS_SUCCESS, 'sounds', 'queryID');
const fetchFailure = makeActionCreator(at.FETCH_SOUNDS_FAILURE, 'error', 'queryID');
const updateSoundsPosition = makeActionCreator(at.UPDATE_SOUNDS_POSITION, 'sounds', 'queryID');
const mapComputationComplete = makeActionCreator(at.MAP_COMPUTATION_COMPLETE);

const getTrainedTsne = (sounds, queryParams) => {
  const tsne = new tsnejs.Tsne(TSNE_CONFIG);
  const descriptor = queryParams.descriptor || DEFAULT_DESCRIPTOR;
  const descriptorKey = `analysis.${descriptor}`;
  const trainingData = Object.keys(sounds).map(
    soundID => readObjectByString(sounds[soundID], descriptorKey));
  tsne.initDataRaw(trainingData);
  return tsne;
};

let clearTimeoutId;
let stepIteration = 0;
let progress = 0;

const getSoundSpacePosition = (sound, store) => {
  const { spaces } = store.spaces;
  // find the space to which sound belongs to
  const space = spaces.find(curSpace => curSpace.sounds.includes(sound.id));
  return space.position;
};

const computePointsPositionInSolution = (tsne, sounds, store) => {
  const tsneSolution = tsne.getSolution();
  return Object.keys(sounds).reduce((curState, curSoundID, curIndex) => {
    const sound = sounds[curSoundID];
    const mapPosition = store.map;
    let { spacePosition } = sound;
    if (!spacePosition) {
      spacePosition = getSoundSpacePosition(sound, store);
    }
    const tsnePosition = {
      x: tsneSolution[curIndex][0],
      y: tsneSolution[curIndex][1],
    };
    const position = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
    return Object.assign({}, curState, {
      [curSoundID]: {
        position,
        spacePosition, // tsne and spacePosition could be useful later (e.g.: when user moves map)
        tsnePosition,
      },
    });
  }, {});
};


const computeTsneSolution = (tsne, sounds, dispatch, queryID, getStore) => {
  /** we retrieve the store at each step to take into account user zooming/moving
  while map being computed */
  const store = getStore();
  // TODO: dispatch updateMapPosition to automatically focus on new space
  if (stepIteration <= MAX_TSNE_ITERATIONS) {
    // compute step solution
    tsne.step();
    stepIteration++;
    const computedProgress = stepIteration / MAX_TSNE_ITERATIONS;
    const computedProgressPercentage = parseInt(100 * computedProgress, 10);
    if (progress !== computedProgressPercentage) {
      // update status message only with new percentage
      progress = computedProgressPercentage;
      const soundsLength = Object.keys(sounds).length;
      const statusMessage =
        `${soundsLength} sounds loaded, computing map (${progress}%)`;
      dispatch(displaySystemMessage(statusMessage));
    }
    const soundsWithUpdatedPosition = computePointsPositionInSolution(tsne, sounds, store);
    dispatch(updateSoundsPosition(soundsWithUpdatedPosition, queryID));
    clearTimeoutId = requestAnimationFrame(() =>
      computeTsneSolution(tsne, soundsWithUpdatedPosition, dispatch, queryID, getStore));
  } else {
    cancelAnimationFrame(clearTimeoutId);
    stepIteration = 0;
    progress = 0;
    dispatch(displaySystemMessage('Map computed!', MESSAGE_STATUS.SUCCESS));
    dispatch(mapComputationComplete());
  }
};


/**
 * Function for calling FS and creating a map for the received sounds.
 *
 * @type {string} query: the query (e.g. 'instrument note')
 * @type {object} queryParams: the parameters of the query
 *       (descriptor, maxResults, maxDuration, minDuration)
 */
export const getSounds = (query, queryParams) => (dispatch, getStore) => {
  dispatch(displaySystemMessage('Searching for sounds...'));
  const queryID = UUID.v4();
  dispatch(fetchRequest(queryID, query, queryParams));
  const { maxResults, maxDuration } = queryParams;
  submitQuery(query, maxResults, maxDuration).then(
    allPagesResults => {
      const sounds = reshapeReceivedSounds(allPagesResults, queryID);
      const soundsFound = Object.keys(sounds).length;
      if (!soundsFound) {
        dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
        dispatch(fetchFailure('no sounds', queryID));
        return;
      }
      dispatch(fetchSuccess(sounds, queryID));
      dispatch(displaySystemMessage(`${soundsFound} sounds loaded, computing map`));
      const tsne = getTrainedTsne(sounds, queryParams);
      computeTsneSolution(tsne, sounds, dispatch, queryID, getStore);
    },
    error => {
      dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
      dispatch(fetchFailure(error, queryID));
    }
  );
};

export const selectSound = makeActionCreator(at.SELECT_SOUND_BY_ID, 'soundID');
export const getSoundBuffer = makeActionCreator(at.GET_SOUND_BUFFER, 'soundID', 'buffer');
export const toggleHoveringSound = makeActionCreator(at.TOGGLE_HOVERING_SOUND, 'soundID');
