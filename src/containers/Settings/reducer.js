import { TOGGLE_PLAY_ON_HOVER } from './actions';
import storable from '../SessionsHandler/storableReducer';

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

export default storable(settings);
