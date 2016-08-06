import { combineReducers } from 'redux';
import messages from './messages';
import metronome from './metronome';
import paths from './paths';

const rootReducer = combineReducers({
  messages, metronome, paths,
});

export default rootReducer;
