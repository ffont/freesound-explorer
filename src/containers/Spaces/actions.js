import makeActionCreator from 'utils/makeActionCreator';
import { removeSound } from '../Sounds/actions';
import { computeClustersFromTsnePos } from './utils';
import { displaySystemMessage } from '../MessagesBox/actions';

export const SET_SPACE_AS_CENTER = 'SET_SPACE_AS_CENTER';
export const REMOVE_SPACE = 'REMOVE_SPACE';
export const CLUSTERS_COMPUTED = 'CLUSTERS_COMPUTED';

export const setSpaceAsCenter = (space) => {
  const spacePosition = space.currentPositionInMap;
  return {
    type: SET_SPACE_AS_CENTER,
    spacePositionX: spacePosition.x,
    spacePositionY: spacePosition.y,
  };
};

const removeSpaceAction = makeActionCreator(REMOVE_SPACE, 'queryID');
const clustersComputed = makeActionCreator(CLUSTERS_COMPUTED, 'queryID', 'clusters');

export const removeSpace = space => (dispatch) => {
  const { query, queryID, sounds } = space;
  dispatch(removeSpaceAction(queryID));
  sounds.forEach(soundID => dispatch(removeSound(soundID)));
  dispatch(displaySystemMessage(`Space "${query}" has been deleted.`));
};

export const computeSpaceClusters = queryID => (dispatch, getStore) => {
  const state = getStore();
  const allsounds = state.sounds.byID;
  const mapPosition = state.map;

  // get space obj for queryID from state
  const space = state.spaces.spaces.find(curSpace =>
    curSpace.queryID === queryID);
  // get sound objs for space
  const sounds = {};
  space.sounds.forEach(soundID => sounds[soundID] = allsounds[soundID]);
  computeClustersFromTsnePos(sounds, space, mapPosition)
  .then(clusters => dispatch(clustersComputed(space.queryID, clusters)));
};

