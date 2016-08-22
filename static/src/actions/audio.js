import makeActionCreator from './makeActionCreator';
import { INIT_AUDIO_CONTEXT, ADD_AUDIO_SRC, STOP_AUDIO_SRC,
  STOP_ALL_AUDIO, PLAY_AUDIO_SRC }
  from './actionTypes';
import { displaySystemMessage } from './messagesBox';
import { MESSAGE_STATUS } from '../constants';
import audioLoader from '../utils/audioLoader';
import '../polyfills/AudioContext';

const initAudioContext = () => {
  const audioContext = new window.AudioContext();
  // create a main gain node to set general volume
  audioContext.gainNode = audioContext.createGain();
  audioContext.gainNode.connect(audioContext.destination);
  const loader = audioLoader(audioContext);
  return { audioContext, loader };
};

// action dispatched, used by reducer to save in store the actual audio context
const initAudioContextAction = makeActionCreator(INIT_AUDIO_CONTEXT, 'context', 'loader');

/**
 * Function called by external component to init audio context
 */
export const initAudio = () => (dispatch, getStore) => {
  const store = getStore();
  if (!store.audioContext || store.audioContext.state !== 'running') {
    // initialize audioContext only if not initialized yet
    const { audioContext, loader } = initAudioContext();
    dispatch(initAudioContextAction(audioContext, loader));
  }
};

const addAudioSource = makeActionCreator(ADD_AUDIO_SRC, 'sourceKey', 'source', 'gain');
export const playAudioSrc = makeActionCreator(PLAY_AUDIO_SRC, 'source');
export const stopAudioSrc = makeActionCreator(STOP_AUDIO_SRC, 'sourceKey');
export const stopAllAudio = makeActionCreator(STOP_ALL_AUDIO);

const loadAudio = (sound, loader) => new Promise((resolve, reject) => {
  if (sound.buffer) {
    resolve(sound.buffer);
  } else {
    loader.loadSound(sound.previewUrl).then(
      decodedAudio => resolve(decodedAudio),
      error => reject(error)
    );
  }
});

export const playAudio = (sound, playbackOptions = {}, onEnded, customSourceNodeKey) =>
  (dispatch, getStore) => {
    const store = getStore();
    const { playbackRate = 1 } = playbackOptions;
    const { context, loader, playingSourceNodes } = store.audio;
    loadAudio(sound, loader).then(
      buffer => {
        const source = context.createBufferSource();
        const sourceGainNode = context.createGain();
        const sourceNodeKey = customSourceNodeKey || Object.keys(playingSourceNodes).length;
        dispatch(addAudioSource(sourceNodeKey, source, sourceGainNode));
        source.onended = () => {
          dispatch(stopAudioSrc(sourceNodeKey));
          if (onEnded) onEnded();
        };
        source.buffer = buffer;
        source.playbackRate.value = playbackRate;
        source.connect(sourceGainNode);
        // TODO: sourceGainNode should change with MIDI velocity
        sourceGainNode.connect(context.gainNode);
        source.start();
      },
      () => {
        dispatch(displaySystemMessage(
          'There was a problem while playing the sound', MESSAGE_STATUS.ERROR));
      }
    );
  };

export const stopAudio = (sound) => (dispatch, getStore) => {
  console.log(sound);
};
