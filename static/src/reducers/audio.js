import { INIT_AUDIO_CONTEXT, ADD_AUDIO_SRC, STOP_AUDIO_SRC } from '../actions/actionTypes';

const initialState = {
  initialised: false,
  context: {},
  loader: {},
  playingSourceNodes: {},
};

const sourceNodes = (state, action) => {
  switch (action.type) {
    case ADD_AUDIO_SRC: {
      const { sourceKey, source, gain } = action;
      return Object.assign({}, state, {
        [sourceKey]: { source, gain },
      });
    }
    case STOP_AUDIO_SRC: {
      const { sourceKey } = action;
      return Object.keys(state).reduce((curState, curSourceKey) => {
        if (curSourceKey === sourceKey) {
          return curState;
        }
        return Object.assign(curState, { [curSourceKey]: state[curSourceKey] });
      }, {});
    }
    default:
      return state;
  }
};

const audio = (state = initialState, action) => {
  switch (action.type) {
    case INIT_AUDIO_CONTEXT: {
      if (!state.initialised) {
        const { context, loader } = action;
        return Object.assign({}, state, {
          context,
          loader,
          initialised: true,
        });
      }
      return state;
    }
    case ADD_AUDIO_SRC: {
      return Object.assign({}, state, {
        playingSourceNodes: sourceNodes(state.playingSourceNodes, action),
      });
    }
    case STOP_AUDIO_SRC: {
      return Object.assign({}, state, {
        playingSourceNodes: sourceNodes(state.playingSourceNodes, action),
      });
    }
    default:
      return state;
  }
};

export default audio;
