import { TOGGLE_SIDEBAR_VISIBILITY, SET_SIDEBAR_TAB }
  from '../actions/actionTypes';
import { DEFAULT_SIDEBAR_TAB, SIDEBAR_TABS } from '../constants';
import '../polyfills/Array.includes';

const initialState = {
  isVisible: true,
  activeTab: DEFAULT_SIDEBAR_TAB,
};

const sidebar = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR_VISIBILITY: {
      return Object.assign({}, state, {
        isVisible: !state.isVisible,
      });
    }
    case SET_SIDEBAR_TAB: {
      const allowedTabs = Object.keys(SIDEBAR_TABS).reduce((curState, tabKey) =>
        [...curState, SIDEBAR_TABS[tabKey]], []);
      if (allowedTabs.includes(action.newTab)) {
        return Object.assign({}, state, {
          activeTab: action.newTab,
          isVisible: true,  // re-open sidebar if currently closed
        });
      }
      return state;
    }
    default:
      return state;
  }
};

export default sidebar;
