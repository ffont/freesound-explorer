import { UPDATE_MAP_POSITION, SET_SPACE_AS_CENTER } from '../actions/actionTypes';
import { getMapCenter } from '../utils/uiUtils';

/*
  forceMapUpdate = true when a new map position is forced externally (such when the user
  creates a new space, with consequential focus on it).
  forceMapUpdate = false when the user moves the map around (i.e. when we have to
  update the map position according to the actual interaction with it).
 */

export const initialState = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  forceMapUpdate: false,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAP_POSITION: {
      const { translateX, translateY, scale } = action.position;
      const forceMapUpdate = false;
      return Object.assign({}, state, { translateX, translateY, scale, forceMapUpdate });
    }
    case SET_SPACE_AS_CENTER: {
      const { spacePositionX, spacePositionY } = action;
      const { scale } = state;
      const mapCenter = getMapCenter();
      const finalTranslateX = (mapCenter.x - spacePositionX) / scale;
      const finalTranslateY = (mapCenter.y - spacePositionY) / scale;
      const forceMapUpdate = true;
      return Object.assign({}, state, {
        translateX: finalTranslateX,
        translateY: finalTranslateY,
        forceMapUpdate });
    }
    default:
      return state;
  }
};

export default map;
