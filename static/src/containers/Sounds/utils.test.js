import { isSoundInsideScreen } from './utils';

describe('sound utils', () => {
  describe('isSoundInsideScreen', () => {
    it('works as expected', () => {
      const position = { cx: -50, cy: -50 };
      expect(isSoundInsideScreen(position)).toEqual(false);
    });
  });
});
