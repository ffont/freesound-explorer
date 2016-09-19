import expect from 'expect';
import { selectSound, getSoundBuffer, toggleHoveringSound, removeSound,
  deselectSound, UPDATE_SOUNDS_POSITION, FETCH_SOUNDS_SUCCESS,
  MAP_COMPUTATION_COMPLETE }
  from './actions';
import { playAudioSrc, stopAudioSrc } from '../Audio/actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';
import { selectedSounds, byID, sound } from './reducer';
import { computeSoundGlobalPosition, thumbnailMapPosition } from './utils';
import { range } from '../../utils/arrayUtils';

const sound0 = {
  id: 'sound0',
  url: '//path/to/audio',
  position: { cx: 10, cy: 20 },
  spacePosition: { x: 1, y: 1 },
  tsnePosition: { x: 0.2, y: 0.1 },
  queryID: 0,
};
const sound1 = {
  id: 'sound1',
  url: '//path/to/audio',
  position: { cx: 100, cy: 40 },
  spacePosition: { x: 1, y: 1 },
  tsnePosition: { x: 2, y: 0.5 },
  queryID: 1,
};

const allSoundsByID = { sound0, sound1 };

describe('sound', () => {
  describe('update sounds position', () => {
    it('works as expected', () => {
      const action = {
        type: UPDATE_SOUNDS_POSITION,
        sounds: {
          sound0: { position: { cx: 20, cy: 40 } },
        },
      };
      expect(sound(sound0, action)).toEqual(Object.assign({}, sound0, {
        position: { cx: 20, cy: 40 },
      }));
    });
  });
  describe('update map position', () => {
    it('correctly forces update of sounds positions', () => {
      const action = {
        type: UPDATE_MAP_POSITION,
        position: { translateX: 1, translateY: 1, scale: 2 },
      };
      const { tsnePosition, spacePosition } = sound0;
      const expectedSoundPosition =
        computeSoundGlobalPosition(tsnePosition, spacePosition, action.position);
      expect(sound(sound0, action).position).toEqual(expectedSoundPosition);
    });
  });
  describe('map computation complete', () => {
    it('correctly triggers the computation of position in thumbnail', () => {
      const action = { type: MAP_COMPUTATION_COMPLETE, queryID: 0 };
      const expectedThumbnailPosition =
        computeSoundGlobalPosition(sound0.tsnePosition, { x: 1, y: 1 }, thumbnailMapPosition);
      expect(sound(sound0, action).thumbnailPosition).toEqual(expectedThumbnailPosition);
      // no thumbnailPosition expected for sounds of different spaces/queries
      expect(sound(sound1, action).thumbnailPosition).toEqual(undefined);
    });
  });
});

describe('byID', () => {
  it('stores new sounds at each query', () => {
    const action = { type: FETCH_SOUNDS_SUCCESS, sounds: allSoundsByID };
    expect(byID(undefined, action)).toEqual(allSoundsByID);
  });
  it('stores received buffers', () => {
    const buffer = [0, 0.2, 0.1, 0.2];
    const action = getSoundBuffer('sound0', buffer);
    expect(byID(allSoundsByID, action).sound0.buffer).toEqual(buffer);
  });
  it('correctly handles sound hovering', () => {
    const action = toggleHoveringSound('sound0');
    expect(byID(allSoundsByID, action).sound0.isHovered).toEqual(true);
  });
  it('correcly handles multiple sound hoverings', () => {
    const numberOfHoverings = 2;
    const stateAfter = range(numberOfHoverings).reduce(curState =>
      byID(curState, toggleHoveringSound('sound0')), allSoundsByID);
    expect(stateAfter.sound0.isHovered).toEqual(false);
  });
  it('correctly handles audio playback', () => {
    const sourceKey = '';
    const action0 = playAudioSrc(sourceKey, 'sound0');
    const action1 = stopAudioSrc(sourceKey, 'sound0');
    const stateAfterAction0 = byID(allSoundsByID, action0);
    expect(stateAfterAction0.sound0.isPlaying).toEqual(true);
    const stateAfterAction1 = byID(stateAfterAction0, action1);
    expect(stateAfterAction1.sound0.isPlaying).toEqual(false);
  });
  it('correctly handles sounds removal', () => {
    const expectedState = { sound1 };
    expect(byID(allSoundsByID, removeSound('sound0'))).toEqual(expectedState);
  });
});

describe('selectedSound', () => {
  it('correctly adds a selected sound', () => {
    expect(selectedSounds(undefined, selectSound('sound0'))).toEqual(['sound0']);
  });
  it('correctly adds multiple selected sounds', () => {
    const stateAfter = ['sound1', 'sound2'].reduce((curState, curSound) =>
      selectedSounds(curState, selectSound(curSound)), undefined);
    expect(stateAfter).toEqual(['sound1', 'sound2']);
  });
  it('correctly handles sounds removal', () => {
    expect(selectedSounds(['sound0', 'sound1'], removeSound('sound0')))
      .toEqual(['sound1']);
    expect(selectedSounds(['sound0', 'sound1'], removeSound('sound2')))
      .toEqual(['sound0', 'sound1']);
  });
  it('correctly handles sounds deselection', () => {
    expect(selectedSounds(['sound0', 'sound1'], deselectSound('sound0')))
      .toEqual(['sound1']);
    expect(selectedSounds(['sound0', 'sound1'], deselectSound('sound2')))
      .toEqual(['sound0', 'sound1']);
  });
});
