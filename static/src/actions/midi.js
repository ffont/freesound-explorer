import makeActionCreator from './makeActionCreator';
import { ADD_MIDI_NOTE_MAPPING, REMOVE_MIDI_NOTE_MAPPING, SET_MIDI_LEARN_SOUND_ID }
  from './actionTypes';


export const setIsMidiLearningSoundID = makeActionCreator(SET_MIDI_LEARN_SOUND_ID, 'soundID');
export const addMidiNoteMapping = makeActionCreator(ADD_MIDI_NOTE_MAPPING, 'note', 'soundID');
export const removeMidiNoteMapping = makeActionCreator(REMOVE_MIDI_NOTE_MAPPING, 'note');
