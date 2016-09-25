import { NEW_SESSION, LOAD_SESSION } from './actions';
import storable, { reducersToExport } from './storableReducer';

const testInitialState = [];
const testBaseReducer = (state = testInitialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const testReducer = storable(testBaseReducer);

describe('storable higher-order reducer', () => {
  it('correcly adds to list of reducers to export', () => {
    expect(reducersToExport).toEqual(['testBaseReducer']);
  });
  it('resets correctly', () => {
    const stateBefore = [1, 2, 3];
    const action = { type: NEW_SESSION };
    expect(testReducer(stateBefore, action)).toEqual(testInitialState);
  });
  it('loads correctly', () => {
    const stateBefore = [1, 2, 3];
    const stateAfter = [4, 5];
    const action = { type: LOAD_SESSION, testBaseReducer: stateAfter };
    expect(testReducer(stateBefore, action)).toEqual(stateAfter);
  });
});
