import makeActionCreator from './makeActionCreator';
import { ADD_MIDI_NOTE_MAPPING, REMOVE_MIDI_NOTE_MAPPING, SET_MIDI_LEARN_SOUND_ID,
  SET_LATEST_RECEIVED_MIDI_MESSAGE, SET_MIDI_SUPPORTED, SET_MIDI_INPUT_CHANNEL,
  SET_MIDI_INPUT_DEVICE, SET_MIDI_AVAILABLE_DEVICES } from './actionTypes';
import { displaySystemMessage } from './messagesBox';
import { midiMessageTypeLabel } from '../utils/midiUtils';
import { playAudio, stopAudio } from './audio';


export const setIsMidiLearningSoundID = makeActionCreator(SET_MIDI_LEARN_SOUND_ID, 'soundID');
export const addMidiNoteMapping = makeActionCreator(ADD_MIDI_NOTE_MAPPING, 'note', 'soundID');
export const removeMidiNoteMapping = makeActionCreator(REMOVE_MIDI_NOTE_MAPPING, 'note');
export const setLatestReceivedMidiMessage = makeActionCreator(
  SET_LATEST_RECEIVED_MIDI_MESSAGE, 'message');
export const setMidiSupported = makeActionCreator(SET_MIDI_SUPPORTED, 'midiSupported');
export const setMidiInputChannel = makeActionCreator(SET_MIDI_INPUT_CHANNEL, 'channelNumber');
export const setMidiInputDevice = makeActionCreator(SET_MIDI_INPUT_DEVICE, 'deviceName');
export const setMidiAvailableDevices = makeActionCreator(SET_MIDI_AVAILABLE_DEVICES, 'devicesList');

export const handleNoteOff = (note) => (dispatch, getStore) => {
  const store = getStore();
  const closestNote = Object.keys(store.midi.midiMappings.notes).reduce((prev, curr) =>
    (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
  const soundID = store.midi.midiMappings.notes[closestNote];
  const sourceNodeKey = `node_${note}`;
  dispatch(stopAudio(soundID, sourceNodeKey));
};

export const handleNoteOn = (note, velocity) => (dispatch, getStore) => {
  const store = getStore();
  // Find closest note with assigned sound and play with adjusted playback rate
  const closestNote = Object.keys(store.midi.midiMappings.notes).reduce((prev, curr) =>
    (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
  const soundID = store.midi.midiMappings.notes[closestNote];
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

export const onMIDIMessage = (message) => (dispatch, getStore) => {
  const store = getStore();
  const type = message.data[0] & 0xf0;
  const channel = (message.data[0] - type) + 1; // channel 1-16
  const note = message.data[1];
  const velocity = message.data[2];
  const inputDevice = message.target.name;

  // Filter by midi channel if midi input channel is not undefined
  if ((store.midi.inputChannel !== undefined) && (channel !== store.midi.inputChannel)) {
    return 0;
  }

  // Filter by input device if input device is not undefined
  if ((store.midi.inputDevice !== undefined) && (inputDevice !== store.midi.inputDevice)) {
    return 0;
  }

  dispatch(setLatestReceivedMidiMessage({ type, note, velocity, channel }));
  switch (midiMessageTypeLabel(type)) {
    case 'Note On': { // noteOn message
      if (store.midi.isMidiLearningsoundID) {
        dispatch(addMidiNoteMapping(note, store.midi.isMidiLearningsoundID));
        dispatch(setIsMidiLearningSoundID(undefined));
      } else if (Object.keys(store.midi.midiMappings.notes).length > 0) {
        // Only handle message if mappings exist
        dispatch(handleNoteOn(note, velocity));
      }
      break;
    }
    case 'Note Off': { // noteOff message
      if (Object.keys(store.midi.midiMappings.notes).length > 0) {
        // Only handle message if mappings exist
        dispatch(handleNoteOff(note));
      }
      break;
    }
    default:
      break;
  }
  return 0;
};

export const setUpMIDIDevices = () => (dispatch, getStore) => {
  const store = getStore();
  if (window.navigator.requestMIDIAccess) {
    window.navigator.requestMIDIAccess().then(
      (midiAccess) => {
        dispatch(setMidiSupported(true));
        // Disconnect existing devices
        store.midi.availableMIDIDevices.forEach((device) => {
          device.value.onmidimessage = null;
        });
        // Iterate over all existing MIDI devices and connect them to onMIDIMessage
        const inputs = midiAccess.inputs.values();
        const devicesList = [];
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          devicesList.push(input);
          input.value.onmidimessage = (data) => dispatch(onMIDIMessage(data));
        }
        dispatch(setMidiAvailableDevices(devicesList));
      }, () => {
      dispatch(setMidiSupported(false));
      dispatch(displaySystemMessage('No MIDI support...', 'error'));
    });
  } else {
    dispatch(setMidiSupported(false));
    dispatch(displaySystemMessage('No MIDI support in your browser...', 'error'));
  }
};
