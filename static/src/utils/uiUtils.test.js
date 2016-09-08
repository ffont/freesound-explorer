import expect from 'expect';
import { isSoundInsideScreen } from './uiUtils';

describe('uiUtils', () => {
  describe('isSoundInsideScreen', () => {
    it('works as expected', () => {
      const position = { cx: -50, cy: -50 };
      expect(isSoundInsideScreen(position)).toEqual(false);
    });
  });
});
