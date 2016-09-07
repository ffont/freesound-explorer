import makeActionCreator from './makeActionCreator';
import { audioContext } from './audio';
import { LOOKAHEAD, SCHEDULEAHEADTIME, TICKRESOLUTION } from '../constants';
import * as at from './actionTypes';

export const updateMetronomeStatus = makeActionCreator(at.UPDATE_METRONOME_STATUS,
  'bar', 'beat', 'tick');

export const setTempo = makeActionCreator(at.SET_TEMPO,
  'tempo');

export const startStopMetronome = makeActionCreator(at.STARTSTOP_METRONOME,
  'isPlaying');

export const setPlaySound = makeActionCreator(at.SET_PLAY_SOUND,
  'playSound');

export const setStartedMetronomeAtMount = makeActionCreator(at.SET_STARTED_METRONOME_AT_MOUNT,
  'startedMetronomeAtMount');

let schedulerTimer;
let updateStateInSyncTimer;
let lastTickDrawn = -1;
let drawTicksInQueue = [];
let currentTick = 0;
let currentBar = 1;
let nextTickTime;

function playMetronomeSound(tick, time) {
  // Play metronome sound (only quarter notes)
  if (tick % (TICKRESOLUTION / 4) === 0) {
    const frequency = (tick % TICKRESOLUTION === 0) ? 880.0 : 440.0;
    const osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);
    osc.frequency.value = frequency;
    osc.start(time);
    osc.stop(time + 0.05);
  }
}

export const audioScheduler = () => (dispatch, getStore) => {
  const store = getStore();
  const currentTime = audioContext.currentTime;
  while (nextTickTime < currentTime + SCHEDULEAHEADTIME) {
    // Avoid trying to play ticks that were missed by more than 50ms
    if (nextTickTime >= (currentTime - 0.05)) {
      // Trigger tick event
      const bar = currentBar;
      const beat = Math.floor(currentTick / (TICKRESOLUTION / 4));
      const tick = currentTick;
      const time = nextTickTime;
      const event = new CustomEvent('tick', { detail: { bar, beat, tick, time } });
      window.dispatchEvent(event);

      if (store.metronome.playSound) {
        playMetronomeSound(tick, time);
      }

      // Add tick info to queue for updating display
      drawTicksInQueue.push({ bar, beat, tick, time });
    }
    // Advance to next tick according to tick resolution
    nextTickTime += (4 / TICKRESOLUTION) * (60.0 / store.metronome.tempo);
    currentTick += 1;
    if (currentTick === TICKRESOLUTION) {
      currentTick = 0;
      currentBar += 1;
    }
  }
  schedulerTimer = setTimeout(() => { dispatch(audioScheduler()); }, LOOKAHEAD);
};

export const updateStateInSync = () => (dispatch, getStore) => {
  const store = getStore();
  if (store.metronome.isPlaying) {
    const currentTime = audioContext.currentTime;
    let currentTickToDraw = lastTickDrawn;
    while (drawTicksInQueue.length && drawTicksInQueue[0].time < currentTime) {
      currentTickToDraw = Object.assign({}, drawTicksInQueue[0]);
      drawTicksInQueue.splice(0, 1);
    }
    if (lastTickDrawn.tick !== currentTickToDraw.tick) {
      // Update metronome status so UI is updated too
      dispatch(updateMetronomeStatus(
        currentTickToDraw.bar,
        currentTickToDraw.beat,
        currentTickToDraw.tick
      ));
      lastTickDrawn = currentTickToDraw;
    }
    // Call this function at every requestAnimationFrame
    updateStateInSyncTimer = setTimeout(() => { dispatch(updateStateInSync()); }, LOOKAHEAD * 2);
  }
};

export const startMetronome = () => (dispatch) => {
  lastTickDrawn = -1;
  drawTicksInQueue = [];
  currentTick = 0;
  currentBar = 1;
  const [bar, beat, tick] = [1, 0, 0];
  dispatch(updateMetronomeStatus(bar, beat, tick));
  dispatch(startStopMetronome(true));
  nextTickTime = audioContext.currentTime;
  schedulerTimer = setTimeout(() => { dispatch(audioScheduler()); }, LOOKAHEAD);
  updateStateInSyncTimer = setTimeout(() => { dispatch(updateStateInSync()); }, LOOKAHEAD * 2);
};

export const stopMetronome = () => (dispatch) => {
  clearTimeout(schedulerTimer);
  clearTimeout(updateStateInSyncTimer);
  dispatch(startStopMetronome(false));
  const [bar, beat, tick] = [1, 0, 0];
  dispatch(updateMetronomeStatus(bar, beat, tick));
};
