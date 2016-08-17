import { combineReducers } from 'redux';
import login from './login';
import map from './map';
import messagesBox from './messagesBox';
import metronome from './metronome';
import paths from './paths';
import search from './search';
import sounds from './sounds';
import spaces from './spaces';


const rootReducer = combineReducers({
  login,
  map,
  messagesBox,
  metronome,
  paths,
  search,
  sounds,
  spaces,
});

export default rootReducer;
