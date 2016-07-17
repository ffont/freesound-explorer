import 'babel-polyfill';
import 'normalize.css';
import { render } from 'react-dom';
import React from 'react';
import App from './components/App';

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};

if (!!ReactPerf) {
  window.ReactPerf = ReactPerf;
}

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const app = render(<App windowSize={{ windowWidth, windowHeight }} />,
  document.getElementById('app'));

window.setSessionStorage = app.setSessionStorage;
window.handleSuccessfulLogin = app.handleSuccessfulLogin;
window.handleFailedLogin = app.handleFailedLogin;
