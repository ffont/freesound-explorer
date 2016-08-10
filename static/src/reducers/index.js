import { combineReducers } from 'redux';
import login from './login';
import messagesBox from './messagesBox';
import metronome from './metronome';
import paths from './paths';
import sounds from './sounds';
import spaces from './spaces';


const rootReducer = combineReducers({
  login,
  messagesBox,
  metronome,
  paths,
  sounds,
  spaces,
});

export default rootReducer;
