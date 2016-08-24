import React from 'react';
import Map from '../Map';
import Login from '../Login';
import Logo from '../Logo';
import MIDI from '../MIDI';
import Sidebar from '../Sidebar';
import MessagesBox from '../MessagesBox';
import '../../stylesheets/App.scss';

function App() {
  return (
    <div className="app-container">
      <MIDI />
      <Login />
      <Map />
      <Sidebar />
      <MessagesBox />
      <Logo />
    </div>
  );
}

export default App;
