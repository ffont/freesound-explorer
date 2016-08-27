import { UPDATE_MAP_POSITION } from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const updateMapPosition = makeActionCreator(UPDATE_MAP_POSITION, 'position');

export const moveToDifferentSpace = (spaceID) => (dispatch, getStore) => {
  // TODO
  // 1) compute the final { translateX, translateY, scale } values for focusing on new space
  //    based on the spacePosition of any sound of that space (use getStore to retrieve it)
  // 2) compute some intermediate steps of { translateX, translateY, scale }
  // 3) use requestAnimationFrame to animate the transition through the steps computed in 2),
  //    using `dispatch(updateMapPosition)` on each step
  //    NB: write each step on an exported separate function, to call them from ./sounds too
};
