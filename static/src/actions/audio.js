import makeActionCreator from './makeActionCreator';
import { ADD_AUDIO_SRC, STOP_AUDIO_SRC,
  STOP_ALL_AUDIO, PLAY_AUDIO_SRC }
  from './actionTypes';
import { getSoundBuffer } from './sounds';
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

export const { audioContext, loader } = initAudioContext();

const addAudioSource = makeActionCreator(ADD_AUDIO_SRC, 'sourceKey', 'source', 'gain');
export const playAudioSrc = makeActionCreator(PLAY_AUDIO_SRC, 'sourceKey', 'soundID');
export const stopAudioSrc = makeActionCreator(STOP_AUDIO_SRC, 'sourceKey', 'soundID');
export const stopAllAudio = makeActionCreator(STOP_ALL_AUDIO);

const loadAudio = (sound) => new Promise((resolve, reject) => {
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
    const { playingSourceNodes } = store.audio;
    loadAudio(sound).then(
      buffer => {
        const source = audioContext.createBufferSource();
        const sourceGainNode = audioContext.createGain();
        const sourceNodeKey = customSourceNodeKey || Object.keys(playingSourceNodes).length;
        dispatch(getSoundBuffer(sound.id, buffer));
        dispatch(addAudioSource(sourceNodeKey, source, sourceGainNode));
        source.onended = () => {
          dispatch(stopAudioSrc(sourceNodeKey, sound.id));
          if (onEnded) onEnded();
        };
        source.buffer = buffer;
        source.playbackRate.value = playbackRate;
        source.connect(sourceGainNode);
        // TODO: sourceGainNode should change with MIDI velocity
        sourceGainNode.connect(audioContext.gainNode);
        source.start();
        dispatch(playAudioSrc(sourceNodeKey, sound.id));
      }
    );
  };

export const stopAudio = (sound) => (dispatch, getStore) => {
};
