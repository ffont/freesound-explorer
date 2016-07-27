import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import App from './components/App';

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};

if (!!ReactPerf) {
  window.ReactPerf = ReactPerf;
}

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let store = createStore(rootReducer);

const app = render(
  <Provider store={store}>
    <App windowSize={{ windowWidth, windowHeight }} />
  </Provider>,
  document.getElementById('app'));

window.setSessionStorage = app.setSessionStorage;
window.handleSuccessfulLogin = app.handleSuccessfulLogin;
window.handleFailedLogin = app.handleFailedLogin;
