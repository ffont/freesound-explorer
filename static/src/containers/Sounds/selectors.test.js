import expect from 'expect';
import { makeIsSoundSelected } from './selectors';

const state = { sounds: { selectedSounds: ['sound0', 'sound1'] } };

describe('makeIsSoundSelected', () => {
  it('works as expected', () => {
    const isSound0Selected = makeIsSoundSelected('sound0');
    const isSound2Selected = makeIsSoundSelected('sound2');
    expect(isSound0Selected(state)).toEqual(true);
    expect(isSound2Selected(state)).toEqual(false);
  });
});
