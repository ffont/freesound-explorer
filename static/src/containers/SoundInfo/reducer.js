import { OPEN_MODAL_FOR_SOUND, HIDE_MODAL } from './actions';
import { UPDATE_SOUNDS_POSITION } from '../Sounds/actions';
import { UPDATE_MAP_POSITION } from '../Map/actions';
import { soundInfoModalHeight } from 'json!../../stylesheets/variables.json';

const modalHeight = parseInt(soundInfoModalHeight, 10);

const isVisibleRedux = (state = false, action) => {
  switch (action.type) {
    case OPEN_MODAL_FOR_SOUND:
      return true;
    case HIDE_MODAL:
      return false;
    default:
      return state;
  }
};

const initialPositionState = {
  position: { top: 0, left: 0 },
  direction: 'up',
};

const getDirectionForPosition = (position) => {
  if (position.top < modalHeight) {
    return 'down';
  }
  return 'up';
};

const positionRedux = (state = initialPositionState, action, curSoundID, allSounds) => {
  switch (action.type) {
    case OPEN_MODAL_FOR_SOUND: {
      const { sound } = action;
      const position = { top: sound.position.cy, left: sound.position.cx };
      const direction = getDirectionForPosition(position);
      return { position, direction };
    }
    case UPDATE_SOUNDS_POSITION: {
      if (!action.sounds[curSoundID]) {
        return state;
      }
      const newSoundPosition = action.sounds[curSoundID].position;
      const position = { top: newSoundPosition.cy, left: newSoundPosition.cx };
      const direction = getDirectionForPosition(position);
      return { position, direction };
    }
    case UPDATE_MAP_POSITION: {
      if (!allSounds[curSoundID]) {
        return state;
      }
      const newSoundPosition = allSounds[curSoundID].position;
      const position = { top: newSoundPosition.cy, left: newSoundPosition.cx };
      const direction = getDirectionForPosition(position);
      return { position, direction };
    }
    default:
      return state;
  }
};

const soundIDRedux = (state = '', action) => {
  switch (action.type) {
    case OPEN_MODAL_FOR_SOUND: {
      return action.sound.id;
    }
    default:
      return state;
  }
};

export default (state = {}, action, allSounds) => {
  const isVisible = isVisibleRedux(state.isVisible, action);
  const soundID = soundIDRedux(state.soundID, action);
  const { position, direction } = positionRedux({
    position: state.position,
    direction: state.direction,
  }, action, soundID, allSounds);
  return { isVisible, soundID, position, direction };
};
