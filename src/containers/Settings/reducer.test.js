import { togglePlayOnHover, setShouldPlayOnHover, toggleClusterTags } from './actions';
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
  it('correctly sets shouldPlayOnHover setting', () => {
    const stateBefore = { shouldPlayOnHover: false };
    const stateAfter = { shouldPlayOnHover: true };
    expect(reducer(stateBefore, setShouldPlayOnHover(true)))
      .toEqual(stateAfter);
    expect(reducer(stateAfter, setShouldPlayOnHover(false)))
      .toEqual(stateBefore);
  });
  it('correctly sets shouldShowClusterTags setting', () => {
    const stateBefore = { shouldShowClusterTags: false };
    const stateAfter = { shouldShowClusterTags: true };
    expect(reducer(stateBefore, toggleClusterTags(true)))
      .toEqual(stateAfter);
    expect(reducer(stateAfter, toggleClusterTags(false)))
      .toEqual(stateBefore);
  });
});
