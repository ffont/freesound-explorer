import { DISPLAY_MESSAGE } from '../actions/actionTypes';
import { MESSAGE_STATUS } from '../constants';

const initialState = {
  message: '',
  status: MESSAGE_STATUS.INFO,
};

export default function messages(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_MESSAGE: {
      const status = action.status || MESSAGE_STATUS.INFO;
      return {
        message: action.message,
        status,
      };
    }
    default:
      return state;
  }
}
