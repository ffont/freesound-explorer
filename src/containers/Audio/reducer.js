import { ADD_AUDIO_SRC, STOP_AUDIO_SRC } from './actions';

// TODO: what about PLAY_AUDIO_SRC actions?

export const initialState = { sourceNodes: {} };

const sourceNodes = (state = initialState.sourceNodes, action) => {
  switch (action.type) {
    case ADD_AUDIO_SRC: {
      const { sourceKey, source, gain, soundID } = action;
      return Object.assign({}, state, {
        // N.B. sourceKey will be a string key, not an number
        [sourceKey]: { source, gain, soundID },
      });
    }
    case STOP_AUDIO_SRC: {
      const { sourceKey } = action;
      return Object.keys(state).reduce((curState, curSourceKey) => {
        // remove source from currently playing nodes
        // cast to string as programmatically created objects' keys are stored as string
        if (`${curSourceKey}` === `${sourceKey}`) {
          return curState;
        }
        console.log("curState: ", curState, "state: ", state, "curSourceKey: ", curSourceKey);
        // overwrite stopped nodes with undefined to delete them
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
