import { MESSAGE_STATUS } from 'constants';
import { DISPLAY_MESSAGE } from './actions';

export const initialState = {
  message: '',
  status: '',
  messageCount: 0,
};

const messagesBox = (state = initialState, action) => {
  switch (action.type) {
    case DISPLAY_MESSAGE: {
      const status = action.status || MESSAGE_STATUS.INFO;
      return {
        message: action.message,
        status,
         // We store number of total messages issued to trigger state chanegs with repeated messages
        messageCount: state.messageCount + 1,
      };
    }
    default:
      return state;
  }
};

export default messagesBox;
