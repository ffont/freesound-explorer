import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { default as reducer, initialState } from './reducer';
import { addMidiNoteMapping, setSoundCurrentlyLearnt } from './actions';

describe('midi reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('setSoundCurrentlyLearnt', () => {
    const stateBefore = initialState;
    const soundID = 10;
    const stateAfter = Object.assign({}, stateBefore, { soundCurrentlyLearnt: soundID });
    it('correctly updates state', () => {
      expect(reducer(stateBefore, setSoundCurrentlyLearnt(soundID))).toEqual(stateAfter);
    });
  });
  describe('addMidiNoteMapping', () => {
    const stateBefore = initialState;
    const note = 64;
    const soundID = 1234;
    const stateAfter = Object.assign({}, stateBefore, {
      notesMapped: { [note]: soundID },
    });
    it('correctly adds new mapping', () => {
      expect(reducer(stateBefore, addMidiNoteMapping(note, soundID))).toEqual(stateAfter);
    });
  });
});
