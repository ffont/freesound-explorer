import { UPDATE_MAP_POSITION, SET_SPACE_AS_CENTER } from './actionTypes';
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
