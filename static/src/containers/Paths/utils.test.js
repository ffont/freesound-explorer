import * as utils from './utils';

describe('paths utils', () => {
  describe('computePathname', () => {
    const state = [{}, {}, {}];
    it('works as expected', () => {
      expect(utils.computePathname(state)).toEqual('D');
    });
  });
});
