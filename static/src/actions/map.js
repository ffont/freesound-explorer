import { UPDATE_MAP_POSITION, SET_SPACE_AS_CENTER, REMOVE_SPACE,
  REMOVE_SOUND } from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');

export const setSpaceAsCenter = (space) => {
  const spacePosition = space.currentPositionInMap;
  return {
    type: SET_SPACE_AS_CENTER,
    spacePositionX: spacePosition.x,
    spacePositionY: spacePosition.y,
  };
};

export const removeSound = makeActionCreator(REMOVE_SOUND, 'soundID');

const removeSpaceAction = makeActionCreator(REMOVE_SPACE, 'queryID');

export const removeSpace = (space) => (dispatch) => {
  dispatch(removeSpaceAction(space.queryID));
  space.sounds.forEach(soundID => dispatch(removeSound(soundID)));
};
