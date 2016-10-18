import { TOGGLE_PLAY_ON_HOVER, TOGGLE_METRONOME_SOUND,
  SET_SHOULD_PLAY_ON_HOVER } from './actions';
import storable from '../SessionsHandler/storableReducer';

export const initialState = {
  shouldPlayOnHover: false,
  shouldPlayMetronomeSound: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PLAY_ON_HOVER: {
      return Object.assign({}, state, {
        shouldPlayOnHover: !state.shouldPlayOnHover,
      });
    }
    case SET_SHOULD_PLAY_ON_HOVER: {
      return Object.assign({}, state, {
        shouldPlayOnHover: action.shouldPlayOnHover,
      });
    }
    case TOGGLE_METRONOME_SOUND: {
      return Object.assign({}, state, {
        shouldPlayMetronomeSound: !state.shouldPlayMetronomeSound,
      });
    }
    default:
      return state;
  }
};

export default storable(settings);
