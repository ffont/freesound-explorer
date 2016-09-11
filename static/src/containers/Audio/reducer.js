import { ADD_AUDIO_SRC, STOP_AUDIO_SRC } from './actions';

const sourceNodes = (state = {}, action) => {
  switch (action.type) {
    case ADD_AUDIO_SRC: {
      const { sourceKey, source, gain, soundID } = action;
      return Object.assign({}, state, {
        [sourceKey]: { source, gain, soundID },
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

const audio = (state = {}, action) => ({
  playingSourceNodes: sourceNodes(state.playingSourceNodes, action),
});

export default audio;
