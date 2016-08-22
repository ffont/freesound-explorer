import expect from 'expect';
import deepFreeze from 'deep-freeze';
import '../polyfills/Object.assign';
import { default as reducer, initialState } from './midi';
import { addMidiMapping, setIsMidiLearningSoundId } from '../actions/midi';

describe('midi reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('setIsMidiLearningSoundId', () => {
    const stateBefore = initialState;
    const soundId = 10;
    const stateAfter = Object.assign({}, stateBefore, { isMidiLearningSoundId: soundId });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, setIsMidiLearningSoundId(soundId))).toEqual(stateAfter);
    });
  });
  describe('addMidiMapping', () => {
    const stateBefore = initialState;
    const note = 64;
    const soundId = 1234;
    const stateAfter = Object.assign({}, stateBefore, {
      midiMappings: { notes: { [note]: soundId } },
    });
    it('correctly adds new mapping', () => {
      expect(reducer(stateBefore, addMidiMapping(note, soundId))).toEqual(stateAfter);
    });
    it('correctly removes existing note mapping', () => {
      expect(reducer(stateAfter, addMidiMapping(note, -1))).toEqual(initialState);
    });
  });
});
