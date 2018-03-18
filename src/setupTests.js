const mockNode = { connect() {}, onaudioprocess() {} };

window.AudioContext = () => ({
  createGain: () => mockNode,
  createJavaScriptNode: () => mockNode,
});
