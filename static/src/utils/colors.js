export function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(r, g, b) {
  // usage: rgbToHex(0, 51, 255); // #0033ff
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
