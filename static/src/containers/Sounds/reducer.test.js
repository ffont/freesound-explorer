import expect from 'expect';
import { selectSound, getSoundBuffer, toggleHoveringSound, removeSound,
  UPDATE_SOUNDS_POSITION, FETCH_SOUNDS_SUCCESS, MAP_COMPUTATION_COMPLETE }
  from './actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';
import { selectedSound, byID, sound } from './reducer';
import { computeSoundGlobalPosition, thumbnailMapPosition } from './utils';

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
});

describe('selectedSound', () => {

});
