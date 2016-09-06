import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};

if (ReactPerf) {
  window.ReactPerf = ReactPerf;
}

render(<App />, document.getElementById('app'));
