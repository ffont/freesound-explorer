import makeActionCreator from './makeActionCreator';
import { UPDATE_LOGIN_MODAL_VISIBILITY, UPDATE_USER_LOGGED_STATUS,
  UPDATE_BACK_END_AUTH_SUPPORT, UPDATE_LOGGED_USERNAME }
  from './actionTypes';

export const updateLoginModalVisibilility =
  makeActionCreator(UPDATE_LOGIN_MODAL_VISIBILITY, 'isModalVisible');

export const updateUserLoggedStatus =
  makeActionCreator(UPDATE_USER_LOGGED_STATUS, 'isUserLoggedIn');

export const updateBackEndAuthSupport =
  makeActionCreator(UPDATE_BACK_END_AUTH_SUPPORT, 'isEndUserAuthSupported');

export const updateLoggedUsername =
  makeActionCreator(UPDATE_LOGGED_USERNAME, 'username');
