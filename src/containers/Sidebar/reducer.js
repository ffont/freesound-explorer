import { TOGGLE_SIDEBAR_VISIBILITY, SET_SIDEBAR_TAB, EXAMPLE_QUERY_DONE,
  MOVE_SIDEBAR_ARROW }
  from './actions';
import { DEFAULT_SIDEBAR_TAB, SIDEBAR_TABS } from '../../constants';

export const initialState = {
  isVisible: true,
  activeTab: DEFAULT_SIDEBAR_TAB,
  isExampleQueryDone: false,
  bottomArrowPosition: 0,
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
    case EXAMPLE_QUERY_DONE: {
      return Object.assign({}, state, {
        isExampleQueryDone: true,
      });
    }
    case MOVE_SIDEBAR_ARROW: {
      return Object.assign({}, state, {
        bottomArrowPosition: parseInt(action.position, 10),
      });
    }
    default:
      return state;
  }
};

export default sidebar;
