import deepFreeze from 'deep-freeze';
import { updateLoginModalVisibilility, updateUserLoggedStatus,
  updateBackEndAuthSupport, updateLoggedUsername }
  from './actions';
import { default as reducer, initialState } from './reducer';

describe('login reducer', () => {
  it('creates the right initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  deepFreeze(initialState);
  describe('updateLoginModalVisibilility', () => {
    const stateBefore = initialState;
    const isModalVisible = true;
    const stateAfter = Object.assign({}, stateBefore, {
      isModalVisible,
    });
    it('correctly shows the modal', () => {
      expect(reducer(stateBefore, updateLoginModalVisibilility(isModalVisible)))
        .toEqual(stateAfter);
    });
    const stateBeforeHiding = Object.assign({}, initialState, { isModalVisible: true });
    const stateAfterHiding = initialState;
    it('correctly hides the modal', () => {
      expect(reducer(stateBeforeHiding, updateLoginModalVisibilility(false)))
        .toEqual(stateAfterHiding);
    });
  });
  describe('updateUserLoggedStatus', () => {
    const stateBefore = initialState;
    const stateAfter = Object.assign({}, initialState, { isUserLoggedIn: true });
    it('user status correctly updates when loggin in', () => {
      expect(reducer(stateBefore, updateUserLoggedStatus(true))).toEqual(stateAfter);
    });
    const stateBeforeLoggingOut = stateAfter;
    const stateAfterLoggingOut = stateBefore;
    it('user status correctly updates when loggin out', () => {
      expect(reducer(stateBeforeLoggingOut, updateUserLoggedStatus(false)))
        .toEqual(stateAfterLoggingOut);
    });
  });
  describe('updateBackEndAuthSupport', () => {
    const stateBefore = initialState;
    const stateAfter = Object.assign({}, initialState, { isEndUserAuthSupported: true });
    it('correctly updates when back-end available', () => {
      expect(reducer(stateBefore, updateBackEndAuthSupport(true))).toEqual(stateAfter);
    });
  });
  describe('updateLoggedUsername', () => {
    const stateBefore = initialState;
    const username = 'sixstrings89';
    const stateAfter = Object.assign({}, initialState, { username });
    it('correctly updates the username', () => {
      expect(reducer(stateBefore, updateLoggedUsername(username))).toEqual(stateAfter);
    });
  });
});
