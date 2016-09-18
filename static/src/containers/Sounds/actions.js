import { default as UUID } from 'node-uuid';
import { displaySystemMessage } from '../MessagesBox/actions';
import makeActionCreator from '../../utils/makeActionCreator';
import { submitQuery, reshapeReceivedSounds } from '../../utils/fsQuery';
import { MESSAGE_STATUS, TSNE_CONFIG, DEFAULT_DESCRIPTOR, MAX_TSNE_ITERATIONS }
  from '../../constants';
import { setSpaceAsCenter } from '../Spaces/actions';
import { readObjectPropertyByPropertyAbsName } from '../../utils/objectUtils';
import { computeSoundGlobalPosition } from './utils';
import tsnejs from '../../vendors/tsne';
import '../../polyfills/requestAnimationFrame';

export const FETCH_SOUNDS_REQUEST = 'FETCH_SOUNDS_REQUEST';
export const FETCH_SOUNDS_SUCCESS = 'FETCH_SOUNDS_SUCCESS';
export const FETCH_SOUNDS_FAILURE = 'FETCH_SOUNDS_FAILURE';
export const UPDATE_SOUNDS_POSITION = 'UPDATE_SOUNDS_POSITION';
export const MAP_COMPUTATION_COMPLETE = 'MAP_COMPUTATION_COMPLETE';
export const SELECT_SOUND_BY_ID = 'SELECT_SOUND_BY_ID';
export const GET_SOUND_BUFFER = 'GET_SOUND_BUFFER';
export const TOGGLE_HOVERING_SOUND = 'TOGGLE_HOVERING_SOUND';
export const REMOVE_SOUND = 'REMOVE_SOUND';

// no need to exports all these actions as they will be used internally in getSounds
const fetchRequest = makeActionCreator(FETCH_SOUNDS_REQUEST, 'queryID', 'query', 'queryParams');
const fetchSuccess = makeActionCreator(FETCH_SOUNDS_SUCCESS, 'sounds', 'queryID', 'mapPosition');
const fetchFailure = makeActionCreator(FETCH_SOUNDS_FAILURE, 'error', 'queryID');
const updateSoundsPosition = makeActionCreator(UPDATE_SOUNDS_POSITION, 'sounds', 'queryID');
const mapComputationComplete = makeActionCreator(MAP_COMPUTATION_COMPLETE, 'queryID');

const getTrainedTsne = (sounds, queryParams) => {
  const tsne = new tsnejs.Tsne(TSNE_CONFIG);
  const descriptor = queryParams.descriptor || DEFAULT_DESCRIPTOR;
  const descriptorKey = `analysis.${descriptor}`;
  const trainingData = Object.keys(sounds).map(
    soundID => readObjectPropertyByPropertyAbsName(sounds[soundID], descriptorKey));
  tsne.initDataRaw(trainingData);
  return tsne;
};

let clearTimeoutId;
let progress = 0;

const getSoundSpacePosition = (sound, store) => {
  const { spaces } = store.spaces;
  // find the space to which sound belongs to
  const space = spaces.find(curSpace => curSpace.queryID === sound.queryID);
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

const updateProgress = (sounds, dispatch, stepIteration) => {
  const computedProgress = (stepIteration + 1) / MAX_TSNE_ITERATIONS;
  const computedProgressPercentage = parseInt(100 * computedProgress, 10);
  if (progress !== computedProgressPercentage) {
    // update status message only with new percentage
    progress = computedProgressPercentage;
    const soundsLength = Object.keys(sounds).length;
    const statusMessage =
      `${soundsLength} sounds loaded, computing map (${progress}%)`;
    dispatch(displaySystemMessage(statusMessage));
  }
};

const centerMapAtNewSpace = (store, queryID, dispatch) => {
  const space = store.spaces.spaces.find(curSpace => curSpace.queryID === queryID);
  dispatch(setSpaceAsCenter(space));
};

const handleFinalStep = (dispatch, queryID) => {
  cancelAnimationFrame(clearTimeoutId);
  dispatch(displaySystemMessage('Map computed!', MESSAGE_STATUS.SUCCESS));
  dispatch(mapComputationComplete(queryID));
};

const updateSounds = (tsne, sounds, store, dispatch, queryID) => {
  const soundsWithUpdatedPosition = computePointsPositionInSolution(tsne, sounds, store);
  dispatch(updateSoundsPosition(soundsWithUpdatedPosition, queryID));
  return soundsWithUpdatedPosition;
};

const computeTsneSolution = (tsne, sounds, dispatch, queryID, getStore, stepIteration = 0) => {
  /** we retrieve the store at each step to take into account user zooming/moving
  while map being computed */
  const store = getStore();
  if (stepIteration <= MAX_TSNE_ITERATIONS) {
    // compute step solution
    tsne.step();
    if (!stepIteration) {
      centerMapAtNewSpace(store, queryID, dispatch);
    }
    updateProgress(sounds, dispatch, stepIteration);
    const updatedSounds = updateSounds(tsne, sounds, store, dispatch, queryID);
    clearTimeoutId = requestAnimationFrame(() =>
      computeTsneSolution(tsne, updatedSounds, dispatch, queryID, getStore, stepIteration + 1));
  } else {
    handleFinalStep(dispatch, queryID);
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
    (allPagesResults) => {
      const sounds = reshapeReceivedSounds(allPagesResults, queryID);
      const soundsFound = Object.keys(sounds).length;
      if (!soundsFound) {
        dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
        dispatch(fetchFailure('no sounds', queryID));
        return;
      }
      const mapPosition = getStore().map;
      dispatch(fetchSuccess(sounds, queryID, mapPosition));
      dispatch(displaySystemMessage(`${soundsFound} sounds loaded, computing map`));
      const tsne = getTrainedTsne(sounds, queryParams);
      computeTsneSolution(tsne, sounds, dispatch, queryID, getStore);
    },
    (error) => {
      dispatch(displaySystemMessage('No sounds found', MESSAGE_STATUS.ERROR));
      dispatch(fetchFailure(error, queryID));
    }
  );
};

export const selectSound = makeActionCreator(SELECT_SOUND_BY_ID, 'soundID');
export const getSoundBuffer = makeActionCreator(GET_SOUND_BUFFER, 'soundID', 'buffer');
export const toggleHoveringSound = makeActionCreator(TOGGLE_HOVERING_SOUND, 'soundID');
export const removeSound = makeActionCreator(REMOVE_SOUND, 'soundID');
