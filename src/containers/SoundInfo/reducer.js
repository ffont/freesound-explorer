import { soundInfoModalHeight } from 'stylesheets/variables.json';
import { OPEN_MODAL_FOR_SOUND, HIDE_MODAL, SUPRESS_MODAL } from './actions';
import { UPDATE_SOUNDS_POSITION } from '../Sounds/actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';

export const modalHeight = parseInt(soundInfoModalHeight, 10);


export const modalDisabledReducer = (state = false, action) => {
  switch (action.type) {
    case SUPRESS_MODAL: {
      return action.modalDisabled;
    }
    default:
      return state;
  }
};

export const isVisibleReducer = (state = false, action) => {
  switch (action.type) {
    case OPEN_MODAL_FOR_SOUND:
      if (!action.modalDisabled) {
        return true;
      }
      return false;
    case HIDE_MODAL:
      return false;
    default:
      return state;
  }
};

export const initialPositionState = {
  position: { top: 0, left: 0 },
  direction: 'up',
};

export const getDirectionForPosition = (position) => {
  if (position.top < modalHeight) {
    return 'down';
  }
  return 'up';
};

export const positionReducer = (state = initialPositionState, action, curSoundID, allSounds) => {
  switch (action.type) {
    case OPEN_MODAL_FOR_SOUND: {
      const { sound } = action;
      const position = { top: sound.position.cy, left: sound.position.cx };
      const direction = getDirectionForPosition(position);
      return { position, direction };
    }
    case UPDATE_SOUNDS_POSITION:
    case UPDATE_MAP_POSITION: {
      const updatedSounds = (action.type === UPDATE_SOUNDS_POSITION) ?
        action.sounds : allSounds;
      if (!updatedSounds[curSoundID]) {
        return state;
      }
      const newSoundPosition = updatedSounds[curSoundID].position;
      const position = { top: newSoundPosition.cy, left: newSoundPosition.cx };
      const direction = getDirectionForPosition(position);
      return { position, direction };
    }
    default:
      return state;
  }
};

export const soundIDReducer = (state = '', action) => {
  switch (action.type) {
    case OPEN_MODAL_FOR_SOUND: {
      return action.sound.id;
    }
    default:
      return state;
  }
};

// Exported reducer receives `allSounds` from parent `sounds` reducer
export default (state = {}, action, allSounds) => {
  const isVisible = isVisibleReducer(state.isVisible, action);
  const modalDisabled = modalDisabledReducer(state.modalDisabled, action);
  const soundID = soundIDReducer(state.soundID, action);
  const { position, direction } = positionReducer({
    position: state.position,
    direction: state.direction,
  }, action, soundID, allSounds);
  return { isVisible, modalDisabled, soundID, position, direction };
};
