import { ADD_MIDI_MAPPING, SET_MIDI_LEARN_SOUND_ID } from '../actions/actionTypes';
import sessions from './sessions';

export const initialState = {
  isMidiLearningsoundID: undefined,
  midiMappings: { notes: {} },
};

const midi = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MIDI_MAPPING: {
      const { note, soundID } = action;
      let newNotes = {};
      if (soundID !== -1) {
        // Add new note mapping
        newNotes = Object.assign({}, state.midiMappings.notes, { [note]: soundID });
      } else {
        // Remove existing note mapping
        newNotes = Object.assign({}, state.midiMappings.notes, {});  // Copy existing notes
        if (Object.hasOwnProperty.call(newNotes, note)) {
          delete newNotes[note];
        }
      }
      const newMappings = Object.assign({}, state.midiMappings, { notes: newNotes });
      return Object.assign({}, state, { midiMappings: newMappings });
    }
    case SET_MIDI_LEARN_SOUND_ID: {
      return Object.assign({}, state, {
        isMidiLearningsoundID: action.soundID,
      });
    }
    default:
      return state;
  }
};

export default sessions(midi);
