import { AT_DISPLAY_MESSAGE, MESSAGE_STATUS } from '../constants';

const initialState = [
  {
    message: '',
    status: MESSAGE_STATUS.INFO,
  },
];

export default function messages(state = initialState, action) {
  switch (action.type) {
    case AT_DISPLAY_MESSAGE:
      return { message: action.message, status: action.status };
    default:
      return state;
  }
}
