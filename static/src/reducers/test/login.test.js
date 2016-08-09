import expect from 'expect';
import deepFreeze from 'deep-freeze';
import '../../polyfills/Object.assign';
import { updateLoginModalVisibilility, updateUserLoggedStatus,
  updateBackEndAuthSupport, updateLoggedUsername }
  from '../../actions/login';
import { default as reducer, initialState } from '../login';

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
});
