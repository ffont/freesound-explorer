import { UPDATE_MAP_POSITION } from '../actions/actionTypes';

export const initialState = {
  translateX: 0,
  translateY: 0,
  scale: 1,
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAP_POSITION: {
      const { translateX, translateY, scale } = action.position;
      return Object.assign({}, state, { translateX, translateY, scale });
    }
    default:
      return state;
  }
};

export default map;
