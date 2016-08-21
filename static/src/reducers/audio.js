import { INIT_AUDIO_CONTEXT, ADD_AUDIO_SRC } from '../actions/actionTypes';

const initialState = {
  initialised: false,
  context: {},
  nodes: {},
};

const audio = (state = initialState, action) => {
  switch (action.type) {
    case INIT_AUDIO_CONTEXT: {
      if (!state.initialised) {
        const { context } = action;
        return {
          context,
          initialised: true,
        };
      }
      return state;
    }
    case ADD_AUDIO_SRC: {
      return state;
    }
    default:
      return state;
  }
};

export default audio;
