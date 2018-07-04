import { togglePlayOnHover, setShouldPlayOnHover, toggleClusterTags, setShortcutAnimation } from './actions';
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
    expect(reducer(stateBefore, toggleClusterTags()))
      .toEqual(stateAfter);
    expect(reducer(stateAfter, toggleClusterTags()))
      .toEqual(stateBefore);
  });
  it('correctly skips the animation of expanding circles during calculation', () => {
    const stateBefore = { shortcutAnimation: false };
    const stateAfter = { shortcutAnimation: true };
    expect(reducer(stateBefore, setShortcutAnimation(true)))
      .toEqual(stateAfter);
    expect(reducer(stateAfter, setShortcutAnimation(false)))
      .toEqual(stateBefore);
  });
});
