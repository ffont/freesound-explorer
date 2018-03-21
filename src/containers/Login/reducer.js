import { UPDATE_LOGIN_MODAL_VISIBILITY, UPDATE_USER_LOGGED_STATUS,
  UPDATE_BACK_END_AUTH_SUPPORT, UPDATE_LOGGED_USERNAME }
  from './actions';


// TODO: RESET LOGIN FLAG TO FALSE!!
export const initialState = {
  isModalVisible: false,
  isUserLoggedIn: true,
  isEndUserAuthSupported: false,
  username: '',
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOGIN_MODAL_VISIBILITY: {
      return Object.assign({}, state, {
        isModalVisible: action.isModalVisible,
      });
    }
    case UPDATE_USER_LOGGED_STATUS: {
      return Object.assign({}, state, {
        isUserLoggedIn: action.isUserLoggedIn,
      });
    }
    case UPDATE_BACK_END_AUTH_SUPPORT: {
      return Object.assign({}, state, {
        isEndUserAuthSupported: action.isEndUserAuthSupported,
      });
    }
    case UPDATE_LOGGED_USERNAME: {
      return Object.assign({}, state, {
        username: action.username,
      });
    }
    default:
      return state;
  }
};

export default login;
