import { TOGGLE_PLAY_ON_HOVER } from '../actions/actionTypes';

const initialState = {
  playOnHover: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PLAY_ON_HOVER: {
      return Object.assign({}, state, {
        playOnHover: !state.playOnHover,
      });
    }
    default:
      return state;
  }
};

export default settings;
