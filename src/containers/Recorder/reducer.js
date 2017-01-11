import { START_RECORDING, STOP_RECORDING } from './actions';

export const initialState = {
  isRecording: false,
};

function isRecordingReducer(state = initialState.isRecording, action) {
  switch (action.type) {
    case START_RECORDING:
    case STOP_RECORDING: {
      return action.type === START_RECORDING;
    }
    default: return state;
  }
}

const recorder = (state = initialState, action) => ({
  isRecording: isRecordingReducer(state.isRecording, action),
});

export default recorder;
