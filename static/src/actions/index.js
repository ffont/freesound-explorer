import { AT_DISPLAY_MESSAGE, MESSAGE_STATUS } from '../constants';

export function displaySystemMessage(message, status = MESSAGE_STATUS.INFO) {
  return { type: AT_DISPLAY_MESSAGE, message, status };
}
