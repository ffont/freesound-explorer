import { toggleSidebarVisibility, setSidebarTab, setExampleQueryDone,
  moveSidebarArrow } from './actions';
import reducer from './reducer';

describe('sidebar reducer', () => {
  describe('toggleSidebarVisibility', () => {
    it('works as expected', () => {
      const stateBefore = { isVisible: true };
      const stateAfter = { isVisible: false };
      expect(reducer(stateBefore, toggleSidebarVisibility()))
        .toEqual(stateAfter);
      expect(reducer(stateAfter, toggleSidebarVisibility()))
        .toEqual(stateBefore);
    });
  });
  describe('setSidebarTab', () => {
    it('works as expected', () => {
      const stateBefore = { activeTab: 'home', isVisible: false };
      // switching tabs should automatically make sidebar visible too
      const stateAfter = { activeTab: 'search', isVisible: true };
      expect(reducer(stateBefore, setSidebarTab('search')))
        .toEqual(stateAfter);
    });
  });
  describe('setExampleQueryDone', () => {
    it('works as expected', () => {
      const stateBefore = { isExampleQueryDone: false };
      const stateAfter = { isExampleQueryDone: true };
      expect(reducer(stateBefore, setExampleQueryDone()))
        .toEqual(stateAfter);
      // state should remain true once triggered
      expect(reducer(stateAfter, setExampleQueryDone()))
        .toEqual(stateAfter);
    });
  });
  describe('moveSidebarArrow', () => {
    it('works as expected', () => {
      const stateBefore = { bottomArrowPosition: 0 };
      const stateAfter = { bottomArrowPosition: 40 };
      const action = moveSidebarArrow('40px');
      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
