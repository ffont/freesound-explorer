import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../store';
import Map from '../Map';
import Login from '../Login';
import Logo from '../Logo';
import MIDI from '../MIDI';
import Modal from '../Modal';
import Sidebar from '../Sidebar';
import MessagesBox from '../MessagesBox';
import '../../stylesheets/App.scss';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <MIDI />
        <Login />
        <Map />
        <Sidebar />
        <MessagesBox />
        <Logo />
        <Modal />
      </div>
    </Provider>
  );
}

export default App;
