import { addAudioSource, stopAudioSrc } from './actions';
import reducer from './reducer';

describe('audio reducer', () => {
  const initialState = { playingSourceNodes: {} };
  // source to add
  const sourceKey = 10;
  const source = {};
  const gain = 1;
  const soundID = 1;
  const expectedStateWithAddedSource = {
    playingSourceNodes: {
      10: { source, gain, soundID },
    },
  };
  it('creates the expected initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('correctly adds a new node', () => {
    expect(reducer(initialState, addAudioSource(sourceKey, source, gain, soundID)))
      .toEqual(expectedStateWithAddedSource);
  });
  it('removes the node once stopped', () => {
    expect(reducer(expectedStateWithAddedSource, stopAudioSrc(sourceKey, soundID)))
      .toEqual(initialState);
  });
});
