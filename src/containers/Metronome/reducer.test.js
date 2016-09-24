import { updateMetronomeStatus, setTempo, startMetronomeAction,
  stopMetronomeAction, setPlaySound }
  from './actions';
import { default as reducer, initialState } from './reducer';

describe('metronome reducer', () => {
  it('creates the right initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  describe('updateMetronomeStatus', () => {
    const bar = 2;
    const beat = 3;
    const tick = 10;
    const stateAfter = Object.assign({}, initialState,
     { bar, beat, tick });
    it('works as expected', () => {
      expect(reducer(initialState, updateMetronomeStatus(bar, beat, tick)))
        .toEqual(stateAfter);
    });
  });
  describe('setTempo', () => {
    const tempo = 130;
    const stateAfter = Object.assign({}, initialState, { tempo });
    it('works correctly', () => {
      expect(reducer(initialState, setTempo(tempo))).toEqual(stateAfter);
    });
  });
  describe('startMetronomeAction', () => {
    const stateAfter = Object.assign({}, initialState, { isPlaying: true });
    it('works correctly', () => {
      expect(reducer(initialState, startMetronomeAction()))
        .toEqual(stateAfter);
    });
  });
  describe('stopMetronomeAction', () => {
    const stateAfter = Object.assign({}, initialState, { isPlaying: false });
    it('works correctly', () => {
      expect(reducer(initialState, stopMetronomeAction()))
        .toEqual(stateAfter);
    });
  });
  describe('setPlaySound', () => {
    const shouldPlaySound = false;
    const stateAfter = Object.assign({}, initialState, { shouldPlaySound });
    it('works correctly', () => {
      expect(reducer(initialState, setPlaySound(shouldPlaySound)))
        .toEqual(stateAfter);
    });
  });
});
