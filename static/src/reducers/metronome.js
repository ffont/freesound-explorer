import { UPDATE_METRONOME_STATUS, SET_TEMPO, STARTSTOP_METRONOME } from '../actions/actionTypes';
import { DEFAULT_TEMPO } from '../constants';
import sessions from './sessions';

const initialState = {
  bar: 1,
  beat: 0,
  tick: 0,
  tempo: DEFAULT_TEMPO,
  isPlaying: false,
};

function metronome(state = initialState, action) {
  switch (action.type) {
    case UPDATE_METRONOME_STATUS: {
      return Object.assign({}, state, {
        bar: action.bar,
        beat: action.beat,
        tick: action.tick,
      });
    }
    case SET_TEMPO: {
      return Object.assign({}, state, {
        tempo: action.tempo,
      });
    }
    case STARTSTOP_METRONOME: {
      return Object.assign({}, state, {
        isPlaying: action.isPlaying,
      });
    }
    default:
      return state;
  }
}

export default sessions(metronome);
