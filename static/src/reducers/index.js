import { combineReducers } from 'redux';
import messages from './messages';
import metronome from './metronome';

const rootReducer = combineReducers({
  messages, metronome,
});

export default rootReducer;
