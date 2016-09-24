import reducer, { initialState } from './reducer';
import { updateSessionName, setSessionID } from './actions';

describe('updateSessionName', () => {
  it('works as expected', () => {
    expect(reducer(initialState, updateSessionName('testName')).name)
      .toBe('testName');
  });
});

describe('setSessionID', () => {
  it('works as expected', () => {
    expect(reducer(initialState, setSessionID('test-id')).id)
      .toBe('test-id');
  });
});
