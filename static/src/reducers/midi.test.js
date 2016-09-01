import expect from 'expect';
import deepFreeze from 'deep-freeze';
import '../polyfills/Object.assign';
import { default as reducer, initialState } from './midi';
import { addMidiMapping, setIsMidiLearningSoundID } from '../actions/midi';

describe('midi reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('setIsMidiLearningSoundID', () => {
    const stateBefore = initialState;
    const soundID = 10;
    const stateAfter = Object.assign({}, stateBefore, { isMidiLearningsoundID: soundID });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, setIsMidiLearningSoundID(soundID))).toEqual(stateAfter);
    });
  });
  describe('addMidiMapping', () => {
    const stateBefore = initialState;
    const note = 64;
    const soundID = 1234;
    const stateAfter = Object.assign({}, stateBefore, {
      midiMappings: { notes: { [note]: soundID } },
    });
    it('correctly adds new mapping', () => {
      expect(reducer(stateBefore, addMidiMapping(note, soundID))).toEqual(stateAfter);
    });
    it('correctly removes existing note mapping', () => {
      expect(reducer(stateAfter, addMidiMapping(note, -1))).toEqual(initialState);
    });
  });
});
