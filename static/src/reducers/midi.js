import { ADD_MIDI_NOTE_MAPPING, REMOVE_MIDI_NOTE_MAPPING, SET_MIDI_LEARN_SOUND_ID,
  SET_LATEST_RECEIVED_MIDI_MESSAGE, SET_MIDI_SUPPORTED, SET_MIDI_INPUT_CHANNEL,
  SET_MIDI_INPUT_DEVICE, SET_MIDI_AVAILABLE_DEVICES } from '../actions/actionTypes';
import { N_MIDI_MESSAGES_TO_KEEP } from '../constants';
import sessions from './sessions';

export const initialState = {
  isMidiLearningsoundID: undefined,
  midiMappings: { notes: {} },
  latestReceivedMessages: [],
  inputDevice: undefined, // undefined = all input devices
  inputChannel: undefined, // undefined = all channels
  isMidiSupported: false,
  availableMIDIDevices: [],
};

const midi = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MIDI_NOTE_MAPPING: {
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
    case REMOVE_MIDI_NOTE_MAPPING: {
      const newNotes = Object.assign({}, state.midiMappings.notes, {});  // Copy existing notes
      if (Object.hasOwnProperty.call(newNotes, action.note)) {
        delete newNotes[action.note];
      }
      const newMappings = Object.assign({}, state.midiMappings, { notes: newNotes });
      return Object.assign({}, state, { midiMappings: newMappings });
    }
    case SET_MIDI_LEARN_SOUND_ID: {
      return Object.assign({}, state, {
        isMidiLearningsoundID: action.soundID,
      });
    }
    case SET_LATEST_RECEIVED_MIDI_MESSAGE: {
      const newLatestReceivedMessages = state.latestReceivedMessages.slice();
      newLatestReceivedMessages.unshift(action.message); // Add to beginning
      return Object.assign({}, state, {
        latestReceivedMessages: newLatestReceivedMessages.slice(0, N_MIDI_MESSAGES_TO_KEEP),
      });
    }
    case SET_MIDI_SUPPORTED: {
      return Object.assign({}, state, {
        isMidiSupported: action.midiSupported,
      });
    }
    case SET_MIDI_INPUT_CHANNEL: {
      return Object.assign({}, state, {
        inputChannel: action.channelNumber,
      });
    }
    case SET_MIDI_INPUT_DEVICE: {
      return Object.assign({}, state, {
        inputDevice: action.deviceName,
      });
    }
    case SET_MIDI_AVAILABLE_DEVICES: {
      return Object.assign({}, state, {
        availableMIDIDevices: action.devicesList,
      });
    }
    default:
      return state;
  }
};

export default sessions(midi);
