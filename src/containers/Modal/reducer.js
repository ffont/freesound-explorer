import { TOGGLE_MODAL, SET_MODAL_PAGE } from './actions';
import { LOAD_SUCCESS, SAVE_SUCCESS } from '../SessionsHandler/actions';

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
    case LOAD_SUCCESS: {
      return initialState;
    }
    case SAVE_SUCCESS: {
      return initialState;
    }
    default:
      return state;
  }
};

export default modal;
