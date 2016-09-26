import { TOGGLE_MODAL, SET_MODAL_PAGE } from './actions';
import { BACKEND_LOAD_SUCCESS } from '../SessionsHandler/actions';

export const initialState = {
  isVisible: false,
  currentPage: '',
};

const modal = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MODAL: {
      const isNowVisible = !state.isVisible;
      const currentPage = (isNowVisible) ? state.currentPage : '';
      return Object.assign({}, state, { isVisible: isNowVisible, currentPage });
    }
    case SET_MODAL_PAGE: {
      return Object.assign({}, state, {
        isVisible: true,
        currentPage: action.newPage,
      });
    }
    case BACKEND_LOAD_SUCCESS: {
      return Object.assign({}, state, {
        isVisible: false,
        currentPage: '',
      });
    }
    default:
      return state;
  }
};

export default modal;
