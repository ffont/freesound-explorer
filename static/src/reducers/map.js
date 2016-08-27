import { UPDATE_MAP_POSITION } from '../actions/actionTypes';

export const initialState = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  forceMapUpdate: false,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAP_POSITION: {
      const { translateX, translateY, scale, updatedFromD3 } = action.position;
      const forceMapUpdate = !updatedFromD3;
      return Object.assign({}, state, { translateX, translateY, scale, forceMapUpdate });
    }
    default:
      return state;
  }
};

export default map;
