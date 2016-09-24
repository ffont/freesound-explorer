import makeActionCreator from 'utils/makeActionCreator';
import { MESSAGE_STATUS } from 'constants';
import { displaySystemMessage } from '../MessagesBox/actions';
import { midiMessageTypeLabel } from './utils';
import { playAudio, stopAudio } from '../Audio/actions';

export const SET_MIDI_LEARN_SOUND_ID = 'SET_MIDI_LEARN_SOUND_ID';
export const ADD_MIDI_NOTE_MAPPING = 'ADD_MIDI_NOTE_MAPPING';
export const REMOVE_MIDI_NOTE_MAPPING = 'REMOVE_MIDI_NOTE_MAPPING';
export const SET_LATEST_RECEIVED_MIDI_MESSAGE = 'SET_LATEST_RECEIVED_MIDI_MESSAGE';
export const SET_MIDI_SUPPORTED = 'SET_MIDI_SUPPORTED';
export const SET_MIDI_INPUT_CHANNEL = 'SET_MIDI_INPUT_CHANNEL';
export const SET_MIDI_INPUT_DEVICE = 'SET_MIDI_INPUT_DEVICE';
export const SET_MIDI_AVAILABLE_DEVICES = 'SET_MIDI_AVAILABLE_DEVICES';
export const DISCONNECT_DEVICES = 'DISCONNECT_DEVICES';


export const setSoundCurrentlyLearnt = makeActionCreator(SET_MIDI_LEARN_SOUND_ID, 'soundID');
export const addMidiNoteMapping = makeActionCreator(ADD_MIDI_NOTE_MAPPING, 'note', 'soundID');
export const removeMidiNoteMapping = makeActionCreator(REMOVE_MIDI_NOTE_MAPPING, 'note');
export const setLatestReceivedMidiMessage = makeActionCreator(
  SET_LATEST_RECEIVED_MIDI_MESSAGE, 'message');
export const setMidiSupported = makeActionCreator(SET_MIDI_SUPPORTED, 'midiSupported');
export const setMidiInputChannel = makeActionCreator(SET_MIDI_INPUT_CHANNEL, 'channelNumber');
export const setMidiInputDevice = makeActionCreator(SET_MIDI_INPUT_DEVICE, 'deviceName');
export const setMidiAvailableDevices = makeActionCreator(SET_MIDI_AVAILABLE_DEVICES, 'devicesList');
export const disconnectExistingDevices = makeActionCreator(DISCONNECT_DEVICES);

export const handleNoteOff = note => (dispatch, getStore) => {
  const store = getStore();
  const closestNote = Object.keys(store.midi.notesMapped).reduce((prev, curr) =>
    (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
  const soundID = store.midi.notesMapped[closestNote];
  const sourceNodeKey = `node_${note}`;
  dispatch(stopAudio(soundID, sourceNodeKey));
};

export const handleNoteOn = (note, velocity) => (dispatch, getStore) => {
  const store = getStore();
  // Find closest note with assigned sound and play with adjusted playback rate
  const closestNote = Object.keys(store.midi.notesMapped).reduce((prev, curr) =>
    (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
  const soundID = store.midi.notesMapped[closestNote];
  const semitonesDelta = note - closestNote;
  const playbackRate = Math.pow(2, (semitonesDelta / 12));
  const sourceNodeKey = `node_${note}`;
  if (soundID) {
    if (velocity > 0) {  // Some midi sources implement noteoff with velocity = 0
      dispatch(playAudio(soundID, { playbackRate }, sourceNodeKey));
    } else {
      dispatch(handleNoteOff(note));
    }
  }
};

const messageNotOnExpectedChannel = (receivedChannel, selectedChannel) =>
  (selectedChannel && (selectedChannel !== receivedChannel));

const messageNotOnExpectedDevice = (receivedDevice, selectedDevice) =>
  (selectedDevice && (selectedDevice !== receivedDevice));

export const onMIDIMessage = message => (dispatch, getStore) => {
  const store = getStore();
  const type = message.data[0];
  const channel = (message.data[0] - type) + 1; // channel 1-16
  const note = message.data[1];
  const velocity = message.data[2];
  const inputDevice = message.target.name;

  if (messageNotOnExpectedChannel(channel, store.midi.inputChannel) ||
    messageNotOnExpectedDevice(inputDevice, store.midi.inputDevice)) {
    return;
  }

  dispatch(setLatestReceivedMidiMessage({ type, note, velocity, channel }));
  switch (midiMessageTypeLabel(type)) {
    case 'Note On': { // noteOn message
      if (store.midi.soundCurrentlyLearnt) {
        dispatch(addMidiNoteMapping(note));
        dispatch(setSoundCurrentlyLearnt());
      } else if (Object.keys(store.midi.notesMapped).length > 0) {
        // Only handle message if mappings exist
        dispatch(handleNoteOn(note, velocity));
      }
      break;
    }
    case 'Note Off': { // noteOff message
      if (Object.keys(store.midi.notesMapped).length > 0) {
        // Only handle message if mappings exist
        dispatch(handleNoteOff(note));
      }
      break;
    }
    default:
      break;
  }
};

export const setUpMIDIDevices = () => (dispatch) => {
  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess().then(
      (midiAccess) => {
        dispatch(setMidiSupported(true));
        dispatch(disconnectExistingDevices());
        // Iterate over all existing MIDI devices and connect them to onMIDIMessage
        const inputs = midiAccess.inputs.values();
        const devicesList = [];
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          devicesList.push(input);
          input.value.onmidimessage = data => dispatch(onMIDIMessage(data));
        }
        dispatch(setMidiAvailableDevices(devicesList));
      }, () => {
      dispatch(setMidiSupported(false));
      dispatch(displaySystemMessage('No MIDI support...', MESSAGE_STATUS.ERROR));
    });
  } else {
    dispatch(setMidiSupported(false));
    dispatch(displaySystemMessage('No MIDI support in your browser...', MESSAGE_STATUS.ERROR));
  }
};
