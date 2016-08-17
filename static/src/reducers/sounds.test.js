import expect from 'expect';
import deepFreeze from 'deep-freeze';
import '../polyfills/Object.assign';
import { default as reducer, initialState } from './sounds';

describe('sounds reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
});
