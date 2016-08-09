import { combineReducers } from 'redux';
import login from './login';
import messagesBox from './messagesBox';
import metronome from './metronome';
import paths from './paths';


const rootReducer = combineReducers({
  login,
  messagesBox,
  metronome,
  paths,
});

export default rootReducer;
