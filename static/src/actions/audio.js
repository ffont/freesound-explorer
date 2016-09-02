import makeActionCreator from './makeActionCreator';
import { ADD_AUDIO_SRC, STOP_AUDIO_SRC, PLAY_AUDIO_SRC }
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
      buffer => {
        const source = audioContext.createBufferSource();
        const sourceGainNode = audioContext.createGain();
        const sourceNodeKey = customSourceNodeKey || Object.keys(playingSourceNodes).length;
        dispatch(getSoundBuffer(sound.id, buffer));
        dispatch(addAudioSource(sourceNodeKey, source, sourceGainNode));
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
      if (Object.keys(sound.playingSourceNodes).includes(sourceNodeKey)) {
        sound.playingGainNodes[sourceNodeKey].gain.exponentialRampToValueAtTime(
          0.01, audioContext.currentTime + fadeOutTime);
        sound.playingSourceNodes[sourceNodeKey].stop(
          audioContext.currentTime + fadeOutTime);  // this will trigger onended callback
        dispatch(stopAudioSrc(sourceNodeKey, sound.id));
      }
    } else {
      // If no specific key provided, stop all source nodes
      Object.keys(sound.playingSourceNodes).forEach((key) => {
        sound.playingGainNodes[key].gain.exponentialRampToValueAtTime(
          0.01, audioContext.currentTime + fadeOutTime);
        sound.playingSourceNodes[key].stop(
          audioContext.currentTime + fadeOutTime);  // this will trigger onended callback
        dispatch(stopAudioSrc(key, sound.id));
      });
    }
  };
