import { TOGGLE_PLAY_ON_HOVER } from './actions';

export const initialState = {
  shouldPlayOnHover: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PLAY_ON_HOVER: {
      return Object.assign({}, state, {
        shouldPlayOnHover: !state.shouldPlayOnHover,
      });
    }
    default:
      return state;
  }
};

export default settings;
