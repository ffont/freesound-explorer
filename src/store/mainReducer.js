import { combineReducers } from 'redux';
import audio from 'containers/Audio/reducer';
import midi from 'containers/Midi/reducer';
import login from 'containers/Login/reducer';
import map from 'containers/Map/reducer';
import messagesBox from 'containers/MessagesBox/reducer';
import metronome from 'containers/Metronome/reducer';
import modal from 'containers/Modal/reducer';
import paths from 'containers/Paths/reducer';
import search from 'containers/Search/reducer';
import session from 'containers/Session/reducer';
import settings from 'containers/Settings/reducer';
import sidebar from 'containers/Sidebar/reducer';
import sounds from 'containers/Sounds/reducer';
import spaces from 'containers/Spaces/reducer';


const rootReducer = combineReducers({
  audio,
  login,
  map,
  messagesBox,
  metronome,
  midi,
  modal,
  paths,
  search,
  session,
  settings,
  sidebar,
  sounds,
  spaces,
});

export default rootReducer;
