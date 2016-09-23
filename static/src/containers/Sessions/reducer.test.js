import reducer, { initialState } from './reducer';
import { updateSessionName } from './actions';

describe('updateSessionName', () => {
  it('works as expected', () => {
    expect(reducer(initialState, updateSessionName('testName')).name)
      .toBe('testName');
  });
});
