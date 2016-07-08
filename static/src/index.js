import 'babel-polyfill';
import 'normalize.css';
import { render } from 'react-dom';
import React from 'react';
import App from './components/App';

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};
const { whyDidYouUpdate } = (process.env.NODE_ENV !== 'production') ?
  require('why-did-you-update') : {};
if (!!ReactPerf) {
  window.ReactPerf = ReactPerf;
}
if (!!whyDidYouUpdate) {
  // whyDidYouUpdate(React);
}

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

render(<App windowSize={{ windowWidth, windowHeight }} />, document.getElementById('app'));
