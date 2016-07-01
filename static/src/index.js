import 'babel-polyfill';
import 'normalize.css';
import { render } from 'react-dom';
import React from 'react';
import App from './components/App';

render(<App />, document.getElementById('app'));
