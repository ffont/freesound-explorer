import { TOGGLE_PLAY_ON_HOVER } from './actions';
import sessions from '../Sessions/reducer';

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

export default sessions(settings);
