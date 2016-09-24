import makeActionCreator from '../../utils/makeActionCreator';

export const UPDATE_LOGIN_MODAL_VISIBILITY = 'UPDATE_LOGIN_MODAL_VISIBILITY';
export const UPDATE_USER_LOGGED_STATUS = 'UPDATE_USER_LOGGED_STATUS';
export const UPDATE_BACK_END_AUTH_SUPPORT = 'UPDATE_BACK_END_AUTH_SUPPORT';
export const UPDATE_LOGGED_USERNAME = 'UPDATE_LOGGED_USERNAME';

export const updateLoginModalVisibilility =
  makeActionCreator(UPDATE_LOGIN_MODAL_VISIBILITY, 'isModalVisible');

export const updateUserLoggedStatus =
  makeActionCreator(UPDATE_USER_LOGGED_STATUS, 'isUserLoggedIn');

export const updateBackEndAuthSupport =
  makeActionCreator(UPDATE_BACK_END_AUTH_SUPPORT, 'isEndUserAuthSupported');

export const updateLoggedUsername =
  makeActionCreator(UPDATE_LOGGED_USERNAME, 'username');
