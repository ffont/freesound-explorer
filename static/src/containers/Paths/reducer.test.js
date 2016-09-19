import expect from 'expect';
import * as paths from './reducer';
import { setPathSync, playPath, stopPath, setPathSoundCurrentlyPlaying,
  selectPath, setPathActive, deleteSoundFromPath, clearAllPaths,
  toggleWaitUntilFinished, ADD_SOUND_TO_PATH, ADD_PATH, REMOVE_PATH }
  from './actions';
import { removeSound } from '../Sounds/actions';
import { computePathname } from './utils';

const pathID = '1';
const path1 = Object.assign({}, paths.pathInitialState, {
  id: pathID,
});

describe('path general behaviour reducer', () => {
  describe('setPathSync', () => {
    const syncMode = '2xbeat';
    it('works as expected', () => {
      expect(paths.path(path1, setPathSync(pathID, syncMode)))
        .toEqual(Object.assign({}, path1, { syncMode }));
    });
  });
});

const soundID = 'sound0';
const soundID2 = 'sound1';
const soundIdx = 0;
const willFinishAt = 0.4;
const pathWithOneSound = Object.assign({}, path1, { sounds: [soundID] });
const pathWithSounds = Object.assign({}, path1, { sounds: [soundID, soundID2] });
const pathWithCurrentlyPlayingSounds = Object.assign({}, pathWithSounds, {
  soundCurrentlyPlaying: { soundIdx, willFinishAt },
});

describe('paths sounds and playback handling', () => {
  describe('add sound to path', () => {
    const action = {
      type: ADD_SOUND_TO_PATH,
      soundID,
      pathID,
    };
    const action2 = {
      type: ADD_SOUND_TO_PATH,
      soundID: soundID2,
      pathID,
    };
    it('works as expected', () => {
      expect(paths.path(path1, action)).toEqual(pathWithOneSound);
      expect(paths.path(pathWithOneSound, action2)).toEqual(pathWithSounds);
    });
  });
  describe('setPathSoundCurrentlyPlaying', () => {
    it('works as expected', () => {
      const action = setPathSoundCurrentlyPlaying(pathID, soundIdx, willFinishAt);
      expect(paths.path(pathWithSounds, action))
        .toEqual(pathWithCurrentlyPlayingSounds);
    });
  });
  describe('toggleWaitUntilFinished', () => {
    it('works as expected', () => {
      expect(paths.path(pathWithCurrentlyPlayingSounds, toggleWaitUntilFinished()))
        .toEqual(Object.assign({}, pathWithCurrentlyPlayingSounds, {
          waitUntilFinished: !paths.pathInitialState.waitUntilFinished,
        }));
    });
  });
  describe('playPath', () => {
    it('works correctly', () => {
      expect(paths.path(pathWithSounds, playPath(pathID)))
        .toEqual(Object.assign({}, pathWithSounds, { isPlaying: true }));
    });
  });
  describe('stopPath', () => {
    it('works correctly', () => {
      expect(paths.path(pathWithSounds, stopPath(pathID)))
        .toEqual(Object.assign({}, pathWithSounds, {
          isPlaying: false,
          soundCurrentlyPlaying: { soundIdx: undefined, willFinishAt: undefined },
        }));
    });
  });
  describe('remove sound', () => {
    const expectedState = Object.assign({}, pathWithSounds, {
      sounds: [soundID],
    });
    it('works when deleting sound from path', () => {
      expect(paths.path(pathWithSounds, deleteSoundFromPath(soundID2, pathID)))
        .toEqual(expectedState);
    });
    it('works when removing the sound', () => {
      expect(paths.path(pathWithSounds, removeSound(soundID2)))
        .toEqual(expectedState);
    });
  });
});

describe('pathsReducer and selectedPath', () => {
  const path2 = Object.assign({}, paths.pathInitialState, {
    id: 'path2',
  });
  const state = [path1, path2];
  const path3 = Object.assign({}, paths.pathInitialState, {
    id: 'path3',
    name: computePathname(state),
    sounds: [],
  });
  const stateAfter = [path1, path2, path3];
  it('correctly adds new path', () => {
    const action = {
      type: ADD_PATH,
      pathID: 'path3',
      sounds: [],
    };
    expect(paths.pathsReducer(state, action)).toEqual(stateAfter);
    expect(paths.selectedPath('', action)).toEqual('path3');
  });
  describe('clearAllPaths', () => {
    it('works as expected', () => {
      expect(paths.pathsReducer(stateAfter, clearAllPaths())).toEqual([]);
      expect(paths.selectedPath('path3', clearAllPaths())).toEqual('');
    });
  });
  describe('selectPath', () => {
    it('works as expected', () => {
      expect(paths.selectedPath('', selectPath('path2'))).toEqual('path2');
    });
  });
  describe('remove path', () => {
    it('works as expected', () => {
      const action = {
        type: REMOVE_PATH,
        pathID: 'path3',
      };
      expect(paths.pathsReducer(stateAfter, action)).toEqual([path1, path2]);
      expect(paths.selectedPath('path3', action)).toEqual('');
      expect(paths.selectedPath('path2', action)).toEqual('path2');
    });
  });
});
