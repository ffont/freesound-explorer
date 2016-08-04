import { UPDATE_METRONOME_STATUS, SET_TEMPO, STARTSTOP_METRONOME } from '../actions/actionTypes';
import { DEFAULT_TEMPO } from '../constants';

const initialState = {
  bar: 1,
  beat: 0,
  note: 0,
  tempo: DEFAULT_TEMPO,
  isPlaying: false,
};

export default function metronome(state = initialState, action) {
  switch (action.type) {
    case UPDATE_METRONOME_STATUS: {
      return Object.assign({}, state, {
        bar: action.bar,
        beat: action.beat,
        note: action.note,
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
