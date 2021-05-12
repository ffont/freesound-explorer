import { N_MIDI_MESSAGES_TO_KEEP } from 'constants';
import { range } from 'utils/arrayUtils';
import deepFreeze from 'deep-freeze';
import reducer, * as midi from './reducer';
import {
  addMidiNoteMapping,
  setSoundCurrentlyLearnt,
  removeMidiNoteMapping,
  setLatestReceivedMidiMessage,
  setMidiSupported,
  setMidiInputChannel,
  setMidiInputDevice,
  setMidiAvailableDevices,
  disconnectExistingDevices,
}
  from './actions';
import { debug } from 'console';

describe('midi reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(midi.initialState);
  });
  deepFreeze(midi.initialState);
  describe('setSoundCurrentlyLearnt', () => {
    const stateBefore = midi.initialState;
    const soundID = 10;
    const stateAfter = { ...stateBefore, soundCurrentlyLearnt: soundID };
    it('correctly updates state', () => {
      expect(reducer(stateBefore, setSoundCurrentlyLearnt(soundID))).toEqual(stateAfter);
    });
  });
  describe('noteMappings', () => {
    const stateBefore = midi.initialState;
    const note = 64;
    const soundID = 1234;
    const stateAfter = { ...stateBefore, notesMapped: { [note]: soundID }, };
    it('correctly adds new mapping', () => {
      expect(reducer(stateBefore, addMidiNoteMapping(note, soundID)))
        .toEqual(stateAfter);
      expect(Object.keys(stateAfter.notesMapped)).toEqual(['64']);
    });
    it('correctly removes mappings', () => {
      expect(reducer(stateAfter, removeMidiNoteMapping(note)))
        .toEqual(stateBefore);
    });
  });
  describe('latestReceivedMessages', () => {
    const message1 = 'message1';
    const message2 = 'message2';
    it('correctly adds message at the beginning', () => {
      const state1 = midi.latestReceivedMessages(midi.initialState.latestReceivedMessages,
        setLatestReceivedMidiMessage(message1));
      const state2 = midi.latestReceivedMessages(state1,
        setLatestReceivedMidiMessage(message2));
      expect(state2[0]).toEqual(message2);
      expect(state2[1]).toEqual(message1);
    });
    it('stores a max amount of messages',
      () => {
        const messagesToAdd = 100;
        console.log("many: ");
        const stateAfter = range(messagesToAdd).reduce((curState, curMessage) =>
          midi.latestReceivedMessages([curState], setLatestReceivedMidiMessage(`${curMessage}`)));
          expect(stateAfter.length).toEqual(N_MIDI_MESSAGES_TO_KEEP);
        expect(stateAfter[0]).toEqual(`${messagesToAdd - 1}`);
      });
  });
  describe('isMidiSupported', () => {
    it('works as expected', () => {
      const isMidiSupported = true;
      const stateAfter = { ...midi.initialState, isMidiSupported};
      expect(reducer(midi.initialState, setMidiSupported(isMidiSupported)))
        .toEqual(stateAfter);
    });
  });
  describe('inputChannel', () => {
    const channel = 4;
    it('works as expected', () => {
      expect(midi.inputChannel(midi.initialState.inputChannel, setMidiInputChannel(channel)))
        .toEqual(channel);
    });
  });
  describe('inputDevice', () => {
    const device = 'device0';
    it('works as expected', () => {
      expect(midi.inputDevice(midi.initialState.inputDevice, setMidiInputDevice(device)))
        .toEqual(device);
    });
  });
  describe('availableMIDIDevices', () => {
    const devices = [{
      value: { onmidimessage: () => {} },
    }, {
      value: { onmidimessage: () => {} },
    }];
    it('correctly adds devices to the list', () => {
      expect(midi.availableMIDIDevices(
        midi.initialState.availableMIDIDevices, setMidiAvailableDevices(devices)))
        .toEqual(devices);
    });
    it('correctly removes devices at reset', () => {
      expect(midi.availableMIDIDevices(devices, disconnectExistingDevices()))
        .toEqual([{
          value: { onmidimessage: undefined },
        }, {
          value: { onmidimessage: undefined },
        }]);
    });
  });
});
