import reducer, { initialState } from './reducer';
import { updateSessionName, setSessionID, setAvailableUserSessions,
  setAvailableDemoSessions } from './actions';

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

describe('setAvailableUserSessions', () => {
  const fakeList = [1, 2, 3];
  it('works as expected', () => {
    expect(reducer(initialState, setAvailableUserSessions(fakeList)).availableUserSessions)
      .toBe(fakeList);
  });
});

describe('setAvailableDemoSessions', () => {
  const fakeList = [1, 2, 3];
  it('works as expected', () => {
    expect(reducer(initialState, setAvailableDemoSessions(fakeList)).availableDemoSessions)
      .toBe(fakeList);
  });
});
