import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { USE_LOCAL_FONTAWESOME } from './constants';

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};

if (process.env.NODE_ENV !== 'production' && USE_LOCAL_FONTAWESOME) {
  // use local fontawesome css file for offline development
  const link = document.createElement('link');
  link.href = 'static/css/font-awesome.min.css';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(link);
}

if (ReactPerf) {
  window.ReactPerf = ReactPerf;
}

render(<App />, document.getElementById('app'));
