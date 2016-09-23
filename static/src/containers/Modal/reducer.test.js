import reducer, { initialState } from './reducer';
import { toggleModal, setModalPage } from './actions';

describe('toggleModal', () => {
  it('works as expected', () => {
    const stateAfter = reducer(initialState, toggleModal());
    expect(stateAfter.isVisible)
      .not.toBe(initialState.isVisible);
    expect(reducer(stateAfter, toggleModal()).isVisible)
      .toBe(initialState.isVisible);
  });
});

describe('setModalPage', () => {
  it('works as expected', () => {
    expect(reducer(initialState, setModalPage('testPage')).currentPage)
      .toBe('testPage');
  });
});
