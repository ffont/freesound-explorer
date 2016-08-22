import { ADD_MIDI_MAPPING, SET_MIDI_LEARN_SOUND_ID } from '../actions/actionTypes';

export const initialState = {
  isMidiLearningSoundId: -1,
  midiMappings: { notes: {} },
};

const midi = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MIDI_MAPPING: {
      const { note, soundId } = action;
      let newNotes = {};
      if (soundId !== -1) {
        // Add new note mapping
        newNotes = Object.assign({}, state.midiMappings.notes, { [note]: soundId });
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
        isMidiLearningSoundId: action.soundId,
      });
    }
    default:
      return state;
  }
};

export default midi;
