import { combineReducers } from 'redux';
import messagesBox from './messagesBox';


const fseReducer = combineReducers({
  messagesBox,
});

export default fseReducer;
