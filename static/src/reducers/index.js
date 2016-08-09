import { combineReducers } from 'redux';
import login from './login';
import messagesBox from './messagesBox';


const fseReducer = combineReducers({
  login,
  messagesBox,
});

export default fseReducer;
