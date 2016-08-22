import React from 'react';
import Map from '../Map';
import AudioContext from '../AudioContext';
import Login from '../Login';
import Logo from '../Logo';
import MIDI from '../MIDI';
import Sidebar from '../Sidebar';
import MessagesBox from '../MessagesBox';
import { getRandomElement } from '../../utils/misc';
import '../../stylesheets/App.scss';
import '../../stylesheets/toggle.scss';
import '../../stylesheets/slider.scss';
import '../../stylesheets/button.scss';

class App extends React.Component {

  setSidebarVisibility(isSidebarVisible) {
    this.setState({
      isSidebarVisible,
    });
  }

  setActiveMode(activeMode) {
    this.setState({
      activeMode,
    });
    if (!this.state.isSidebarVisible) {
      this.setState({
        isSidebarVisible: true,
      });
    }
  }

  playSoundByFreesoundId(freesoundId, onEndedCallback, playbackRate = 1.0, sourceNodeKey, time) {
    if (this.refs.map) {
      this.refs.map.getWrappedInstance().refs[`map-point-${freesoundId}`].playAudio(
        onEndedCallback, playbackRate, sourceNodeKey, time);
    }
  }

  playRandomSound() {
    const sound = getRandomElement(this.state.sounds);
    this.playSoundByFreesoundId(sound.id);
  }

  stopSoundByFreesoundId(freesoundId, sourceNodeKey) {
    if (this.refs.map) {
      this.refs.map.getWrappedInstance().refs[`map-point-${freesoundId}`].stopAudio(sourceNodeKey);
    }
  }

  tooglePlayOnHover() {
    this.setState({
      playOnHover: !this.state.playOnHover,
    });
  }

  render() {
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
}

export default App;
