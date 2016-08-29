import { UPDATE_MAP_POSITION, SET_SPACE_AS_CENTER } from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');

export const setSpaceAsCenter = (space) => {
  const spacePosition = space.positionInMap;
  return {
    type: SET_SPACE_AS_CENTER,
    translateX: (window.innerWidth / 2) - spacePosition.x,
    translateY: (window.innerHeight / 2) - spacePosition.y,
  };
};
