import expect from 'expect';
import deepFreeze from 'deep-freeze';
import '../polyfills/Object.assign';
import { default as reducer, initialState } from './map';
import { updateMapPosition } from '../actions/map';

describe('map reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('updateMapPosition', () => {
    const position = { translateX: 10, translateY: 20, scale: 3 };
    const stateBefore = initialState;
    const stateAfter = Object.assign({}, initialState, position);
    it('correctly updates state', () => {
      expect(reducer(stateBefore, updateMapPosition(position))).toEqual(stateAfter);
    });
  });
});
