import makeActionCreator from '../../utils/makeActionCreator';
import { removeSound } from '../Sounds/actions';

export const SET_SPACE_AS_CENTER = 'SET_SPACE_AS_CENTER';
export const REMOVE_SPACE = 'REMOVE_SPACE';

export const setSpaceAsCenter = (space) => {
  const spacePosition = space.currentPositionInMap;
  return {
    type: SET_SPACE_AS_CENTER,
    spacePositionX: spacePosition.x,
    spacePositionY: spacePosition.y,
  };
};

const removeSpaceAction = makeActionCreator(REMOVE_SPACE, 'queryID');

export const removeSpace = space => (dispatch) => {
  dispatch(removeSpaceAction(space.queryID));
  space.sounds.forEach(soundID => dispatch(removeSound(soundID)));
};
