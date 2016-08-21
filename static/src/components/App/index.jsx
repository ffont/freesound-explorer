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
  componentDidMount() {
    // this.setUpMIDIDevices();
  }

  handleNoteOn(note, velocity) {
    // Find closest note with assigned sound and play with adjusted playback rate
    const closestNote = Object.keys(this.state.midiMappings.notes).reduce((prev, curr) =>
      (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
    const soundId = this.state.midiMappings.notes[closestNote];
    const semitonesDelta = note - closestNote;
    const playBackRate = Math.pow(2, (semitonesDelta / 12));
    const sourceNodeKey = `node_${note}`;
    if (soundId) {
      if (velocity > 0) {  // Some midi sources implement noteoff with velocity = 0
        this.playSoundByFreesoundId(soundId, undefined, playBackRate, sourceNodeKey);
      } else {
        this.handleNoteOff(note);
      }
    }
  }

  handleNoteOff(note) {
    const closestNote = Object.keys(this.state.midiMappings.notes).reduce((prev, curr) =>
      (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
    const soundId = this.state.midiMappings.notes[closestNote];
    const sourceNodeKey = `node_${note}`;
    this.stopSoundByFreesoundId(soundId, sourceNodeKey);
  }

  onMIDIMessage(message) {
    const type = message.data[0] & 0xf0;
    const note = message.data[1];
    const velocity = message.data[2];
    switch (type) {
      case 144: { // noteOn message
        if (this.state.isMidiLearningSoundId > -1) {
          this.state.midiMappings.notes[note] = this.state.isMidiLearningSoundId;
          this.setIsMidiLearningSoundId(-1);
        } else {
          if (Object.keys(this.state.midiMappings.notes).length > 0) {
            // Only handle message if mappings exist
            this.handleNoteOn(note, velocity);
          }
        }
        break;
      }
      case 128: { // noteOff message
        if (Object.keys(this.state.midiMappings.notes).length > 0) {
          // Only handle message if mappings exist
          this.handleNoteOff(note);
        }
        break;
      }
      default:
        break;
    }
  }

  setUpMIDIDevices() {
    if (window.navigator.requestMIDIAccess) {
      window.navigator.requestMIDIAccess().then(
        (midiAccess) => {
          this.state.midiMappings = { notes: {} };
          const inputs = midiAccess.inputs.values();
          // Iterate over all existing MIDI devices and connect them to onMIDIMessage
          for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = (data) => this.onMIDIMessage(data);
          }
        }, () => this.props.displaySystemMessage('No MIDI support...', 'error')
      );
    } else {
      this.props.displaySystemMessage('No MIDI support in your browser...', 'error');
    }
  }

  setIsMidiLearningSoundId(isMidiLearningSoundId) {
    this.setState({
      isMidiLearningSoundId,
    });
  }

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
