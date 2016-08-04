import { UPDATE_METRONOME_INFO } from '../actions/actionTypes';

const initialState = {
  bar: 1,
  beat: 0,
  note: 0,
};

export default function metronome(state = initialState, action) {
  switch (action.type) {
    case UPDATE_METRONOME_INFO: {
      return {
        bar: action.bar,
        beat: action.beat,
        note: action.note,
      };
    }
    default:
      return state;
  }
}
