import makeActionCreator from './makeActionCreator';
import { INIT_AUDIO_CONTEXT, ADD_AUDIO_SRC, STOP_AUDIO_SRC,
  STOP_ALL_AUDIO, PLAY_AUDIO_SRC }
  from './actionTypes';
import '../polyfills/AudioContext';

const initAudioContext = () => {
  const audioContext = new window.AudioContext();
  // create a main gain node to set general volume
  audioContext.gainNode = audioContext.createGain();
  audioContext.gainNode.connect(audioContext.destination);
  return audioContext;
};

const initAudioContextAction = makeActionCreator(INIT_AUDIO_CONTEXT, 'context');

export const initAudio = () => (dispatch, getStore) => {
  const store = getStore();
  if (!store.audioContext || store.audioContext.state !== 'running') {
    // initialize audioContext only if not initialized yet
    const audioContext = initAudioContext();
    dispatch(initAudioContextAction(audioContext));
  }
};

export const addAudioSource = makeActionCreator(ADD_AUDIO_SRC, 'source');
export const playAudioSrc = makeActionCreator(PLAY_AUDIO_SRC, 'source');
export const stopAudioSrc = makeActionCreator(STOP_AUDIO_SRC, 'source');
export const stopAllAudio = makeActionCreator(STOP_ALL_AUDIO);
