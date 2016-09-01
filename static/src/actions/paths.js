import { default as UUID } from 'node-uuid';
import { audioContext, playAudio, stopAudio } from './audio';
import makeActionCreator from './makeActionCreator';
import { elementWithId } from '../utils/arrayUtils';
import * as at from './actionTypes';

export const addPath = (sounds) => ({
  type: at.ADD_PATH,
  sounds,
  pathID: UUID.v4(),
});

export const setPathSync = makeActionCreator(at.SET_PATH_SYNC,
  'pathID', 'syncMode');

export const startStopPath = makeActionCreator(at.STARTSTOP_PATH,
  'pathID', 'isPlaying');

export const setPathCurrentlyPlaying = makeActionCreator(at.SET_PATH_CURRENTLY_PLAYING,
  'pathID', 'soundIDx', 'willFinishAt');

export const selectPath = makeActionCreator(at.SELECT_PATH,
  'pathID');

export const setPathActive = makeActionCreator(at.SET_PATH_ACTIVE,
  'pathID', 'isActive');

export const deleteSoundFromPath = makeActionCreator(at.DELETE_SOUND_FROM_PATH,
  'soundID', 'pathID');

export const addSoundToPath = (soundID, pathID) => (dispatch, getStore) => ({
  type: at.ADD_SOUND_TO_PATH,
  soundID,
  pathID: pathID || getStore().paths.selectedPath,
});

export const clearAllPaths = makeActionCreator(at.CLEAR_ALL_PATHS);

export const setPathWaitUntilFinished = makeActionCreator(at.SET_PATH_WAIT_UNTIL_FINISHED,
  'pathID', 'waitUntilFinished');

export const playNextSoundFromPath = (pathID, time) =>
  (dispatch, getStore) => {
    const store = getStore();
    const path = elementWithId(store.paths.paths, pathID);
    if (path) {
      if (path.isPlaying) {
        let nextSoundToPlayIdx;
        if ((path.currentlyPlaying.soundIDx === undefined) ||
          (path.currentlyPlaying.soundIDx + 1 >= path.sounds.length)) {
          nextSoundToPlayIdx = 0;
        } else {
          nextSoundToPlayIdx = path.currentlyPlaying.soundIDx + 1;
        }
        const nextSoundToPlay = store.sounds.byID[path.sounds[nextSoundToPlayIdx]];
        const nextSoundToPlayDuration = nextSoundToPlay.duration;
        const willFinishAt = (time === undefined) ?
          audioContext.currentTime + nextSoundToPlayDuration : time + nextSoundToPlayDuration;
        dispatch(setPathCurrentlyPlaying(path.id, nextSoundToPlayIdx, willFinishAt));
        if (path.syncMode === 'no') {
          dispatch(playAudio(nextSoundToPlay, undefined, undefined, () => {
            dispatch(playNextSoundFromPath(pathID));
          }));
        } else {
          // If synched to metronome, sounds will be triggered by onAudioTick events
          if (time !== undefined) {
            dispatch(playAudio(path.sounds[nextSoundToPlayIdx], { time }));
          }
        }
      }
    }
  }
