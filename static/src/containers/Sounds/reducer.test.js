import expect from 'expect';
import { UPDATE_SOUNDS_POSITION, FETCH_SOUNDS_SUCCESS,
  MAP_COMPUTATION_COMPLETE } from './actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';
import { selectedSound, byID, sound } from './reducer';
import { computeSoundGlobalPosition } from './utils';

const allSounds = { sound0: { id: 'sound0', position: { cx: 10, cy: 20 } } };
const sound = allSounds.sound0;

describe('sound', () => {
  describe('update sounds position', () => {
    it('works as expected', () => {
    });
  });
});
