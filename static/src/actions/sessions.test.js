import expect from 'expect';
import { persistentFields } from './sessions';
import '../polyfills/Object.assign';

describe('sessions actions', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
});
