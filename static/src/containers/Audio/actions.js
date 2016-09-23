import makeActionCreator from '../../utils/makeActionCreator';
import { getSoundBuffer } from '../Sounds/actions';
import audioLoader from './utils';
import '../../polyfills/AudioContext';

export const ADD_AUDIO_SRC = 'ADD_AUDIO_SRC';
export const STOP_AUDIO_SRC = 'STOP_AUDIO_SRC';
export const PLAY_AUDIO_SRC = 'PLAY_AUDIO_SRC';

const initAudioContext = () => {
  if (!window.AudioContext) {
    return { audioContext: undefined, loader: undefined };
  }
  const audioContext = new window.AudioContext();
  // create a main gain node to set general volume
  audioContext.gainNode = audioContext.createGain();
  audioContext.gainNode.connect(audioContext.destination);
  const loader = audioLoader(audioContext);
  return { audioContext, loader };
};

export const { audioContext, loader } = initAudioContext();

// export for testing, not meant to be called externally
export const addAudioSource = makeActionCreator(ADD_AUDIO_SRC, 'sourceKey', 'source', 'gain', 'soundID');
// TODO: do we actually need 'soundID'? Reducer doesn't use it
export const playAudioSrc = makeActionCreator(PLAY_AUDIO_SRC, 'sourceKey', 'soundID');
export const stopAudioSrc = makeActionCreator(STOP_AUDIO_SRC, 'sourceKey', 'soundID');

const loadAudio = sound => new Promise((resolve, reject) => {
  if (sound.buffer) {
    resolve(sound.buffer);
  } else {
    loader.loadSound(sound.previewUrl).then(
      decodedAudio => resolve(decodedAudio),
      error => reject(error)
    );
  }
});

export const playAudio =
  (soundRef, { playbackRate = 1, time = 0 } = {}, customSourceNodeKey, onEnded) =>
  (dispatch, getStore) => {
    const store = getStore();
    let sound;
    if (typeof soundRef === 'object') {
      sound = soundRef; // soundRef is a sound object
    } else if (typeof soundRef === 'string') {
      sound = store.sounds.byID[soundRef]; // soundRef is a sound id
    }
    const { playingSourceNodes } = store.audio;
    loadAudio(sound).then(
      (buffer) => {
        const source = audioContext.createBufferSource();
        const sourceGainNode = audioContext.createGain();
        const sourceNodeKey = customSourceNodeKey || Object.keys(playingSourceNodes).length;
        dispatch(getSoundBuffer(sound.id, buffer));
        dispatch(addAudioSource(sourceNodeKey, source, sourceGainNode, sound.id));
        source.onended = () => {
          dispatch(stopAudioSrc(sourceNodeKey, sound.id, onEnded));
          if (onEnded) onEnded();
        };
        source.buffer = buffer;
        source.playbackRate.value = playbackRate;
        source.connect(sourceGainNode);
        // TODO: sourceGainNode should change with MIDI velocity
        sourceGainNode.connect(audioContext.gainNode);
        source.start(time);
        dispatch(playAudioSrc(sourceNodeKey, sound.id));
      }
    );
  };

export const stopAudio =
  (soundRef, sourceNodeKey = undefined, fadeOutTime = 0.05) =>
  (dispatch, getStore) => {
    const store = getStore();
    let sound;
    if (typeof soundRef === 'object') {
      sound = soundRef; // soundRef is a sound object
    } else if (typeof soundRef === 'string') {
      sound = store.sounds.byID[soundRef]; // soundRef is a sound id
    }
    if (sourceNodeKey) {
      if (Object.keys(store.audio.playingSourceNodes).includes(sourceNodeKey)) {
        const { source, gain } = store.audio.playingSourceNodes[sourceNodeKey];
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + fadeOutTime);
        source.stop(audioContext.currentTime + fadeOutTime);  // this will trigger onended event
        dispatch(stopAudioSrc(sourceNodeKey, sound.id)); // TODO: Should wait for fadeout time?
      }
    } else {
      // If no specific key provided, stop all source nodes for the corresponding sound
      Object.keys(store.audio.playingSourceNodes).forEach((key) => {
        const { source, gain, soundID } = store.audio.playingSourceNodes[key];
        if (soundID === sound.id) {
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + fadeOutTime);
          source.stop(audioContext.currentTime + fadeOutTime);  // this will trigger onended event
          dispatch(stopAudioSrc(key, sound.id)); // TODO: Should wait for fadeout time?
        }
      });
    }
  };
