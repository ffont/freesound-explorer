import makeActionCreator from './makeActionCreator';
import { ADD_MIDI_MAPPING, SET_MIDI_LEARN_SOUND_ID }
  from './actionTypes';


export const setIsMidiLearningSoundID = makeActionCreator(SET_MIDI_LEARN_SOUND_ID, 'soundID');
export const addMidiMapping = makeActionCreator(ADD_MIDI_MAPPING, 'note', 'soundID');
