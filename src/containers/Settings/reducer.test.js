import { togglePlayOnHover } from './actions';
import reducer, { initialState } from './reducer';

describe('settings reducer', () => {
  it('returns the right initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('correctly toggles shouldPlayOnHover setting', () => {
    const stateBefore = { shouldPlayOnHover: false };
    const stateAfter = { shouldPlayOnHover: true };
    expect(reducer(stateBefore, togglePlayOnHover()))
      .toEqual(stateAfter);
    expect(reducer(stateAfter, togglePlayOnHover()))
      .toEqual(stateBefore);
  });
});
