import { TOGGLE_SIDEBAR_VISIBILITY, SET_SIDEBAR_TAB, EXAMPLE_QUERY_DONE,
  MOVE_SIDEBAR_ARROW }
  from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const toggleSidebarVisibility = makeActionCreator(TOGGLE_SIDEBAR_VISIBILITY);
export const setSidebarTab = makeActionCreator(SET_SIDEBAR_TAB, 'newTab');
export const setExampleQueryDone = makeActionCreator(EXAMPLE_QUERY_DONE);
export const moveSidebarArrow = makeActionCreator(MOVE_SIDEBAR_ARROW, 'position');
