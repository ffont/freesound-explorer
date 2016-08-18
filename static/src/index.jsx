import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import App from './components/App';


const store = configureStore();

// use and expose ReactPerf on development builds
const ReactPerf = (process.env.NODE_ENV !== 'production') ? require('react-addons-perf') : {};

if (ReactPerf) {
  window.ReactPerf = ReactPerf;
}

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'));
