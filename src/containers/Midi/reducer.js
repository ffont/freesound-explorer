import { N_MIDI_MESSAGES_TO_KEEP } from 'constants';
import {
  ADD_MIDI_NOTE_MAPPING,
  REMOVE_MIDI_NOTE_MAPPING,
  SET_MIDI_LEARN_SOUND_ID,
  SET_LATEST_RECEIVED_MIDI_MESSAGE,
  SET_MIDI_SUPPORTED,
  SET_MIDI_INPUT_CHANNEL,
  SET_MIDI_INPUT_DEVICE,
  SET_MIDI_AVAILABLE_DEVICES,
  DISCONNECT_DEVICES,
}
  from './actions';
import storable from '../SessionsHandler/storableReducer';

export const initialState = {
  soundCurrentlyLearnt: '',
  notesMapped: {},
  latestReceivedMessages: [],
  inputDevice: '',
  inputChannel: 0,
  isMidiSupported: false,
  availableMIDIDevices: [],
};

export const soundCurrentlyLearnt = (state = initialState.soundCurrentlyLearnt, action) => {
  switch (action.type) {
    case SET_MIDI_LEARN_SOUND_ID: {
      return action.soundID || '';
    }
    default:
      return state;
  }
};

export const notesMapped = (state = initialState.notesMapped, action, soundLearnt) => {
  switch (action.type) {
    case ADD_MIDI_NOTE_MAPPING: {
      const { note } = action;
      return { ...state, [note]: action.soundID || soundLearnt };
    }
    case REMOVE_MIDI_NOTE_MAPPING: {
      return Object.keys(state).reduce((curState, curNote) => {
        if (`${curNote}` !== `${action.note}`) {
          // add to returned state only notes that are different from action.note
          return Object.assign(curState, { [curNote]: state[curNote] });
        }
        return curState;
      }, {});
    }
    default:
      return state;
  }
};

// state:: Array<MidiMessage>
export const latestReceivedMessages = (state = initialState.latestReceivedMessages, action) => {
  switch (action.type) {
    case SET_LATEST_RECEIVED_MIDI_MESSAGE: {
      // Add to beginning
      const newLatestReceivedMessages = [action.message, ...state];
      return newLatestReceivedMessages.slice(0, N_MIDI_MESSAGES_TO_KEEP);
    }
    default:
      return state;
  }
};

export const inputDevice = (state = initialState.inputDevice, action) => {
  switch (action.type) {
    case SET_MIDI_INPUT_DEVICE: {
      return action.deviceName;
    }
    default:
      return state;
  }
};

export const inputChannel = (state = initialState.inputChannel, action) => {
  switch (action.type) {
    case SET_MIDI_INPUT_CHANNEL: {
      return action.channelNumber;
    }
    default:
      return state;
  }
};

export const isMidiSupported = (state = initialState.isMidiSupported, action) => {
  switch (action.type) {
    case SET_MIDI_SUPPORTED: {
      return action.midiSupported;
    }
    default:
      return state;
  }
};

export const resetDevice = device => (
  {
    ...device,
    value: {
      ...device.value,
      onmidimessage: undefined,
    },
  }
);

export const availableMIDIDevices = (state = initialState.availableMIDIDevices, action) => {
  switch (action.type) {
    case SET_MIDI_AVAILABLE_DEVICES: {
      return action.devicesList;
    }
    case DISCONNECT_DEVICES: {
      return state.map(device => resetDevice(device));
    }
    default:
      return state;
  }
};

const midi = (state = {}, action) => ({
  soundCurrentlyLearnt: soundCurrentlyLearnt(state.soundCurrentlyLearnt, action),
  notesMapped: notesMapped(state.notesMapped, action, state.soundCurrentlyLearnt),
  latestReceivedMessages: latestReceivedMessages(state.latestReceivedMessages, action),
  inputDevice: inputDevice(state.inputDevice, action),
  inputChannel: inputChannel(state.inputChannel, action),
  isMidiSupported: isMidiSupported(state.isMidiSupported, action),
  availableMIDIDevices: availableMIDIDevices(state.availableMIDIDevices, action),
});

export default storable(midi);
