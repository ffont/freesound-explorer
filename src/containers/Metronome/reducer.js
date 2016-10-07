import { DEFAULT_TEMPO } from 'constants';
import { UPDATE_METRONOME_STATUS, SET_TEMPO, START_METRONOME,
  STOP_METRONOME } from './actions';
import storable from '../SessionsHandler/storableReducer';

export const initialState = {
  bar: 1,
  beat: 0,
  tick: 0,
  tempo: DEFAULT_TEMPO,
  isPlaying: false,
};

function barReducer(state = initialState.bar, action) {
  switch (action.type) {
    case UPDATE_METRONOME_STATUS: return action.bar;
    default: return state;
  }
}

function beatReducer(state = initialState.beat, action) {
  switch (action.type) {
    case UPDATE_METRONOME_STATUS: return action.beat;
    default: return state;
  }
}


function tickReducer(state = initialState.tick, action) {
  switch (action.type) {
    case UPDATE_METRONOME_STATUS: return action.tick;
    default: return state;
  }
}

function tempoReducer(state = initialState.tempo, action) {
  switch (action.type) {
    case SET_TEMPO: return action.tempo;
    default: return state;
  }
}

function isPlayingReducer(state = initialState.isPlaying, action) {
  switch (action.type) {
    case START_METRONOME:
    case STOP_METRONOME: {
      return action.type === START_METRONOME;
    }
    default: return state;
  }
}

const metronome = (state = initialState, action) => ({
  bar: barReducer(state.bar, action),
  beat: beatReducer(state.beat, action),
  tick: tickReducer(state.tick, action),
  tempo: tempoReducer(state.tempo, action),
  isPlaying: isPlayingReducer(state.isPlaying, action),
});
export default storable(metronome);
