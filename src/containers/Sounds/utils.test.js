import { mapCircles } from 'stylesheets/variables.json';
import { isSoundInsideScreen } from './utils';

describe('sound utils', () => {
  describe('isSoundInsideScreen', () => {
    const circleDiameter = parseInt(mapCircles.defaultRadius, 10) * 2;
    it('detects when sound is out of screen', () => {
      const position = {
        cx: -circleDiameter - 1, // not visible by just 1px
        cy: -circleDiameter - 1,
      };
      expect(isSoundInsideScreen(position)).toBeFalsy();
    });
    it('detects when sound is inside screen', () => {
      const position = {
        cx: -circleDiameter + 1, // visible by just 1px
        cy: -circleDiameter + 1,
      };
      expect(isSoundInsideScreen(position)).toBeTruthy();
    });
  });
});
