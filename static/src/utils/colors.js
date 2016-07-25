/**
 * Utility functions inspired by Tim Down's post on Stack Overflow
 * http://stackoverflow.com/a/5624139/5664349
 */

export function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const replacedHex = hex.replace(shorthandRegex,
    (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(replacedHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function rgbToHex(r, g, b) {
  // usage: rgbToHex(0, 51, 255); // #0033ff
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export function lightenRGB(r, g, b, lighteningValue) {
  const increment = 100 * lighteningValue;
  return {
    r: parseInt(Math.min(255, r + increment), 10),
    g: parseInt(Math.min(255, g + increment), 10),
    b: parseInt(Math.min(255, b + increment), 10),
  };
}

export function lighten(hex, lighteningValue) {
  const { r, g, b } = hexToRgb(hex);
  const lightenedRGB = lightenRGB(r, g, b, lighteningValue);
  const lightenedHex = rgbToHex(lightenedRGB.r, lightenedRGB.g, lightenedRGB.b);
  return lightenedHex;
}

export function darkenRGB(r, g, b, darkeningValue) {
  const increment = 100 * darkeningValue;
  return {
    r: parseInt(Math.max(0, r - increment), 10),
    g: parseInt(Math.max(0, g - increment), 10),
    b: parseInt(Math.max(0, b - increment), 10),
  };
}

export function darken(hex, darkeningValue) {
  const { r, g, b } = hexToRgb(hex);
  const darkenedRGB = darkenRGB(r, g, b, darkeningValue);
  const darkenedHex = rgbToHex(darkenedRGB.r, darkenedRGB.g, darkenedRGB.b);
  return darkenedHex;
}
