import deepFreeze from 'deep-freeze';
import { removeSoundBuffers } from './utils';

describe('audioLoader', () => {
  describe('removeSoundBuffers', () => {
    it('correctly resets sound buffers', () => {
      const sounds = {
        1: { id: 1, buffer: new ArrayBuffer(10) },
        20: { id: 20, buffer: new ArrayBuffer(20) },
      };
      // the function must be pure
      deepFreeze(sounds);
      const expectedSounds = {
        1: { id: 1, buffer: undefined },
        20: { id: 20, buffer: undefined },
      };
      expect(removeSoundBuffers(sounds)).toEqual(expectedSounds);
    });
  });
});
