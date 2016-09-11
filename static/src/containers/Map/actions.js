import makeActionCreator from './makeActionCreator';

export const UPDATE_MAP_POSITION = 'UPDATE_MAP_POSITION';
export const SET_SPACE_AS_CENTER = 'SET_SPACE_AS_CENTER';
export const REMOVE_SPACE = 'REMOVE_SPACE';

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
