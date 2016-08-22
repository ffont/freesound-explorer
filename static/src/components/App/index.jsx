import React from 'react';
import Map from '../Map';
import AudioContext from '../AudioContext';
import Login from '../Login';
import Logo from '../Logo';
import MIDI from '../MIDI';
import Sidebar from '../Sidebar';
import MessagesBox from '../MessagesBox';
import '../../stylesheets/App.scss';
import '../../stylesheets/toggle.scss';
import '../../stylesheets/slider.scss';
import '../../stylesheets/button.scss';

function App() {
  return (
    <div className="app-container">
      <Logo />
      <AudioContext />
      <MIDI />
      <Sidebar />
      <Login />
      <Map />
      <MessagesBox />
    </div>
  );
}

export default App;
