import { TOGGLE_SIDEBAR_VISIBILITY, SET_SIDEBAR_TAB }
  from './actionTypes';
import makeActionCreator from './makeActionCreator';

export const toggleSidebarVisibility = makeActionCreator(TOGGLE_SIDEBAR_VISIBILITY);
export const setSidebarTab = makeActionCreator(SET_SIDEBAR_TAB, 'newTab');
