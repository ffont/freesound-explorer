import expect from 'expect';
import * as utils from './colorsUtils';

describe('colors utils', () => {
  describe('componentToHex', () => {
    it('works as expected', () => {
      expect(utils.componentToHex(255)).toEqual('ff');
    });
  });
  describe('hexToRgb', () => {
    it('works correctly', () => {
      expect(utils.rgbToHex(0, 51, 255)).toEqual('#0033ff');
    });
  });
  describe('lightenRGB', () => {
    it('works correctly', () => {
      const r = 200;
      const g = 40;
      const b = 150;
      const lightened = utils.lightenRGB(r, g, b, 0.4);
      expect(lightened.r).toBeGreaterThan(r);
      expect(lightened.g).toBeGreaterThan(g);
      expect(lightened.b).toBeGreaterThan(b);
    });
  });
  describe('lighten', () => {
    it('works correctly', () => {
      const hex = '#ff4522';
      const lightened = utils.lighten(hex, 0.4);
      expect(lightened.substring(0, 3)).toEqual('#ff');
    });
  });
  describe('darkenRGB', () => {
    it('works correctly', () => {
      const r = 200;
      const g = 40;
      const b = 150;
      const darkened = utils.darkenRGB(r, g, b, 0.4);
      expect(darkened.r).toBeLessThan(r);
      expect(darkened.g).toBeLessThan(g);
      expect(darkened.b).toBeLessThan(b);
    });
  });
  describe('darken', () => {
    it('works correctly', () => {
      const hex = '#004522';
      const darkened = utils.darken(hex, 0.4);
      expect(darkened.substring(0, 3)).toEqual('#00');
    });
  });
});
