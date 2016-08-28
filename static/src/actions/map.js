import { UPDATE_MAP_POSITION, SET_SPACE_AS_CENTER } from './actionTypes';
import makeActionCreator from './makeActionCreator';
import { MAP_SCALE_FACTOR } from '../constants';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');

const computeTranslationForSpace = (spacePosition, scale = 1) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const translateX = (windowWidth / 2) - ((windowWidth / (MAP_SCALE_FACTOR * 2)) *
    MAP_SCALE_FACTOR * scale * spacePosition.x);
  const translateY = (windowHeight / 2) - ((windowHeight / (MAP_SCALE_FACTOR * 2)) *
    MAP_SCALE_FACTOR * scale * spacePosition.y);
  return { translateX, translateY };
};

export const setSpaceAsCenter = (space, scale = 1) => {
  const { translateX, translateY } = computeTranslationForSpace(space.position, scale);
  return {
    type: SET_SPACE_AS_CENTER,
    translateX,
    translateY,
  };
};
