import { UPDATE_MAP_POSITION, SET_SPACE_AS_CENTER } from '../actions/actionTypes';
import { sidebarWidth } from 'json!../stylesheets/variables.json';

export const mapCenter = {
  x: parseInt(sidebarWidth, 10) + ((window.innerWidth - parseInt(sidebarWidth, 10)) / 2),
  y: (window.innerHeight / 2),
};

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
