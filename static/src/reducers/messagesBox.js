import { DISPLAY_MESSAGE } from '../actions/actionTypes';
import { MESSAGE_STATUS } from '../constants';

export const initialState = {
  message: '',
  status: '',
};

const messagesBox = (state = initialState, action) => {
  switch (action.type) {
    case DISPLAY_MESSAGE: {
      const { message, status } = action;
      return { message, status: status || MESSAGE_STATUS.INFO };
    }
    default:
      return state;
  }
};

export default messagesBox;
