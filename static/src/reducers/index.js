import { combineReducers } from 'redux';
import audio from './audio';
import midi from './midi';
import login from './login';
import map from './map';
import messagesBox from './messagesBox';
import metronome from './metronome';
import paths from './paths';
import search from './search';
import settings from './settings';
import sidebar from './sidebar';
import sounds from './sounds';
import spaces from './spaces';


const rootReducer = combineReducers({
  audio,
  midi,
  login,
  map,
  messagesBox,
  metronome,
  paths,
  search,
  settings,
  sidebar,
  sounds,
  spaces,
});

export default rootReducer;
