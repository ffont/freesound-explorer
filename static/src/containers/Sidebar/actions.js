import makeActionCreator from './makeActionCreator';

export const TOGGLE_SIDEBAR_VISIBILITY = 'TOGGLE_SIDEBAR_VISIBILITY';
export const SET_SIDEBAR_TAB = 'SET_SIDEBAR_TAB';
export const EXAMPLE_QUERY_DONE = 'EXAMPLE_QUERY_DONE';
export const MOVE_SIDEBAR_ARROW = 'MOVE_SIDEBAR_ARROW';

export const toggleSidebarVisibility = makeActionCreator(TOGGLE_SIDEBAR_VISIBILITY);
export const setSidebarTab = makeActionCreator(SET_SIDEBAR_TAB, 'newTab');
export const setExampleQueryDone = makeActionCreator(EXAMPLE_QUERY_DONE);
export const moveSidebarArrow = makeActionCreator(MOVE_SIDEBAR_ARROW, 'position');
