import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import { AppContainer } from 'react-hot-loader';
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

const store = configureStore();

const freesoundExplorerApp = (process.env.NODE_ENV !== 'production') ?
  <AppContainer><App store={store} /></AppContainer> : <App store={store} />;

render(freesoundExplorerApp, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(
      <AppContainer>
        <App store={store} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
