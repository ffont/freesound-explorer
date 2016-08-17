import { FETCH_SOUNDS_SUCCESS, UPDATE_SOUNDS_POSITION }
  from '../actions/actionTypes';

export const initialState = {
  byID: {},
  selectedSound: undefined,
};

const mapSoundsToObject = (sounds) => sounds.reduce((curState, curSound) =>
  Object.assign({}, curState, { [curSound.id]: curSound }), {});

const sounds = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_SUCCESS: {
      const receivedSounds = mapSoundsToObject(action.sounds);
      return Object.assign({}, state, {
        byID: Object.assign({}, state.byID, receivedSounds),
      });
    }
    default:
      return state;
  }
};

export default sounds;
