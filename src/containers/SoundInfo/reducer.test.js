import { isVisibleReducer, modalDisabledReducer, positionReducer, soundIDReducer } from './reducer';
import { openModalForSound, hideModal, suppressModal } from './actions';
import { UPDATE_SOUNDS_POSITION } from '../Sounds/actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';

const allSounds = { sound0: { id: 'sound0', position: { cx: 10, cy: 20 } } };

describe('soundInfo reducer', () => {
  describe('isVisibleReducer', () => {
    it('is not initially visible', () => {
      expect(isVisibleReducer(undefined, {})).toEqual(false);
    });
    it('correctly updates its state', () => {
      expect(isVisibleReducer(false, openModalForSound(allSounds.sound0, false)))
        .toEqual(true);
      expect(isVisibleReducer(true, hideModal()))
        .toEqual(false);
    });
  });
  describe('modalDisabledReducer', () => {
    it('is not initially deactivated', () => {
      expect(modalDisabledReducer(undefined, {})).toEqual(false);
    });
    it('correctly updates its state', () => {
      expect(modalDisabledReducer(false, suppressModal(true)))
        .toEqual(true);
      expect(modalDisabledReducer(true, suppressModal(false)))
        .toEqual(false);
    });
  });
  
  describe('soundIDReducer', () => {
    it('updates when opening modal for new sound', () => {
      expect(soundIDReducer('', openModalForSound(allSounds.sound0)))
        .toEqual('sound0');
    });
    it('doesn\'t update when hiding the modal', () => {
      expect(soundIDReducer('sound0', hideModal()))
        .toEqual('sound0');
    });
  });
  describe('positionReducer', () => {
    const expectedState = { position: { top: 20, left: 10 }, direction: 'down' };
    it('correctly updates on opening', () => {
      expect(positionReducer({}, openModalForSound(allSounds.sound0, false)))
        .toEqual(expectedState);
    });
    it('updates its position when updating sounds positions', () => {
      const action = {
        type: UPDATE_SOUNDS_POSITION,
        sounds: {
          sound0: { id: 'sound0', position: { cx: 50, cy: 100 } },
        },
      };
      expect(positionReducer(expectedState, action, 'sound0'))
        .toEqual({ position: { top: 100, left: 50 }, direction: 'down' });
    });
    it('updates its position when moving maps', () => {
      const action = {
        type: UPDATE_MAP_POSITION,
      };
      expect(positionReducer(expectedState, action, 'sound0', allSounds))
        .toEqual({ position: { top: 20, left: 10 }, direction: 'down' });
    });
  });
});
