import { UPDATE_MAP_POSITION } from './actionTypes';
import makeActionCreator from './makeActionCreator';

const lastMapCenter = {
  translateX: 0,
  translateY: 0,
  scale: 1,
};

const updateMap = makeActionCreator(UPDATE_MAP_POSITION, 'position');

export const updateMapPosition = ({ translateX, translateY, scale, updatedFromD3 }) => dispatch => {
  const position = { scale };
  if (!updatedFromD3) {
    Object.assign(lastMapCenter, { translateX, translateY, scale });
    Object.assign(position, { translateX, translateY });
  } else {
    Object.assign(position, {
      translateX: (lastMapCenter.translateX * scale) + translateX,
      translateY: (lastMapCenter.translateY * scale) + translateY,
    });
  }
  dispatch(updateMap(position));
};

export const moveToDifferentSpace = (spaceID) => (dispatch, getStore) => {
  // TODO
  // 1) compute the final { translateX, translateY, scale } values for focusing on new space
  //    based on the spacePosition of any sound of that space (use getStore to retrieve it)
  // 2) compute some intermediate steps of { translateX, translateY, scale }
  // 3) use requestAnimationFrame to animate the transition through the steps computed in 2),
  //    using `dispatch(updateMapPosition)` on each step
  //    NB: write each step on an exported separate function, to call them from ./sounds too
};
