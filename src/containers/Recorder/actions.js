import makeActionCreator from 'utils/makeActionCreator';
import { audioContext } from '../Audio/actions';
import { startMetronome } from '../Metronome/actions';
import { audioLoader, mergeBuffers, interleave, encodeWAV } from './utils';
import { displaySystemMessage } from '../MessagesBox/actions';
import { MESSAGE_STATUS } from '../../constants';

export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';

export const startRecordingAction = makeActionCreator(START_RECORDING);
export const stopRecordingAction = makeActionCreator(STOP_RECORDING);

/*
Recording flow adapted from https://github.com/mattdiamond/Recorderjs
TODO: this should probably be refactored to an object or something
*/

const bufferLen = 4096;
export const sampleRate = 44100;
let recording = false;
// let recBuffersL = [];
// let recBuffersR = [];
let recBufferL = [];
let recBufferR = [];
let recLength = 0;
let recNode;
let nRecordings = 0;

if (!audioContext.createScriptProcessor) {
  recNode = audioContext.createJavaScriptNode(bufferLen, 2, 2);
} else {
  recNode = audioContext.createScriptProcessor(bufferLen, 2, 2);
}

recNode.onaudioprocess = (e) => {
  if (!recording) return;
  const channelDataL = e.inputBuffer.getChannelData(0);
  const channelDataR = e.inputBuffer.getChannelData(1);
  // recBuffersL.push(channelDataL);
  // recBuffersR.push(channelDataR);
  for (let i = 0; i < channelDataL.length; i += 1) {
    recBufferL.push(channelDataL[i]);
    recBufferR.push(channelDataR[i]);
  }
  recLength += channelDataL.length;
};
audioContext.gainNode.connect(recNode);
recNode.connect(audioContext.destination);

export const record = () => (dispatch, getStore) => {
  const store = getStore();
  if (recording === true) {
    // Stop recording
    dispatch(stopRecordingAction());
    recording = false;

    // Process audio and download
    // const bufferL = mergeBuffers(recBuffersL2, recLength);
    // const bufferR = mergeBuffers(recBuffersL2, recLength);
    const bufferL = Float32Array.from(recBufferL);
    const bufferR = Float32Array.from(recBufferR);
    const interleaved = interleave(bufferL, bufferR);
    const dataview = encodeWAV(interleaved);
    const audioBlob = new Blob([dataview], { type: 'audio/wav' });
    const url = (window.URL || window.webkitURL).createObjectURL(audioBlob);
    const link = window.document.createElement('a');
    link.href = url;
    const date = new Date();
    const downloadFilename = `freesound_explorer_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.wav`;
    link.download = downloadFilename;
    dispatch(displaySystemMessage(`Downloading '${downloadFilename}' (${Math.round((10 * recLength) / sampleRate) / 10} seconds long)...`, MESSAGE_STATUS.SUCCESS));
    link.click();
    /* const click = document.createEvent('Event');
    click.initEvent('click', true, true);
    link.dispatchEvent(click); */

    // Clear buffers etc
    recLength = 0;
    // recBuffersL = [];
    // recBuffersR = [];
    recBufferL = [];
    recBufferR = [];
  } else {
    // Start recording
    dispatch(startRecordingAction());
    dispatch(displaySystemMessage('Start recording...'));
    recording = true;
    nRecordings += 1;
    if (!store.metronome.isPlaying) {
      dispatch(startMetronome());
    }
  }
};
