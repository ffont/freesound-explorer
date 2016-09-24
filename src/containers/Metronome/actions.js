import makeActionCreator from '../../utils/makeActionCreator';
import { audioContext } from '../Audio/actions';
import { LOOKAHEAD, SCHEDULEAHEADTIME, TICKRESOLUTION } from '../../constants';

export const UPDATE_METRONOME_STATUS = 'UPDATE_METRONOME_STATUS';
export const SET_TEMPO = 'SET_TEMPO';
export const START_METRONOME = 'START_METRONOME';
export const STOP_METRONOME = 'STOP_METRONOME';
export const SET_PLAY_SOUND = 'SET_PLAY_SOUND';

export const startMetronomeAction = makeActionCreator(START_METRONOME);
export const stopMetronomeAction = makeActionCreator(STOP_METRONOME);

export const updateMetronomeStatus = makeActionCreator(UPDATE_METRONOME_STATUS,
  'bar', 'beat', 'tick');

export const setTempo = makeActionCreator(SET_TEMPO,
  'tempo');

export const setPlaySound = makeActionCreator(SET_PLAY_SOUND,
  'shouldPlaySound');

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

      if (store.metronome.shouldPlaySound) {
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
  schedulerTimer = setTimeout(() => dispatch(audioScheduler()), LOOKAHEAD);
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
    updateStateInSyncTimer = setTimeout(() => dispatch(updateStateInSync()), LOOKAHEAD * 2);
  }
};

export const startMetronome = () => (dispatch) => {
  lastTickDrawn = -1;
  drawTicksInQueue = [];
  currentTick = 0;
  currentBar = 1;
  const [bar, beat, tick] = [1, 0, 0];
  dispatch(updateMetronomeStatus(bar, beat, tick));
  dispatch(startMetronomeAction());
  nextTickTime = audioContext.currentTime;
  schedulerTimer = setTimeout(() => dispatch(audioScheduler()), LOOKAHEAD);
  updateStateInSyncTimer = setTimeout(() => dispatch(updateStateInSync()), LOOKAHEAD * 2);
};

export const stopMetronome = () => (dispatch) => {
  clearTimeout(schedulerTimer);
  clearTimeout(updateStateInSyncTimer);
  dispatch(stopMetronomeAction());
  const [bar, beat, tick] = [1, 0, 0];
  dispatch(updateMetronomeStatus(bar, beat, tick));
};
