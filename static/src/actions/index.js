import { AT_DISPLAY_MESSAGE, MESSAGE_STATUS } from '../constants';

export const displaySystemMessage = (message, status = MESSAGE_STATUS.INFO) => {
  const action = {
    type: AT_DISPLAY_MESSAGE,
    message,
    status,
  };
  return action;
};
