import 'babel-polyfill';
import 'normalize.css';
import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store';
import App from './components/App';


const store = configureStore();

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};

if (ReactPerf) {
  window.ReactPerf = ReactPerf;
}

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const app = render(
  <Provider store={store}>
    <App windowSize={{ windowWidth, windowHeight }} />
  </Provider>, document.getElementById('app'));

window.setSessionStorage = app.setSessionStorage;
window.handleSuccessfulLogin = app.handleSuccessfulLogin;
window.handleFailedLogin = app.handleFailedLogin;
