import React from 'react';
import { connect } from 'react-redux';
import { displaySystemMessage } from '../../actions/messagesBox';
import { playAudio, stopAudio } from '../../actions/audio';
import { setIsMidiLearningSoundID, addMidiNoteMapping,
  setLatestReceivedMidiMessage } from '../../actions/midi';

const propTypes = {
  displaySystemMessage: React.PropTypes.func,
  setIsMidiLearningSoundID: React.PropTypes.func,
  addMidiNoteMapping: React.PropTypes.func,
  midiMappings: React.PropTypes.object,
  isMidiLearningsoundID: React.PropTypes.string,
  playAudio: React.PropTypes.func,
  stopAudio: React.PropTypes.func,
  setLatestReceivedMidiMessage: React.PropTypes.func,
};

class MIDI extends React.Component {
  componentWillMount() {
    this.setUpMIDIDevices();
  }

  setUpMIDIDevices() {
    if (window.navigator.requestMIDIAccess) {
      window.navigator.requestMIDIAccess().then(
        (midiAccess) => {
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

  onMIDIMessage(message) {
    const type = message.data[0] & 0xf0;
    const note = message.data[1];
    const velocity = message.data[2];
    this.props.setLatestReceivedMidiMessage({ type, note, velocity });
    switch (type) {
      case 144: { // noteOn message
        if (this.props.isMidiLearningsoundID) {
          this.props.addMidiNoteMapping(note, this.props.isMidiLearningsoundID);
          this.props.setIsMidiLearningSoundID(undefined);
        } else if (Object.keys(this.props.midiMappings.notes).length > 0) {
          // Only handle message if mappings exist
          this.handleNoteOn(note, velocity);
        }
        break;
      }
      case 128: { // noteOff message
        if (Object.keys(this.props.midiMappings.notes).length > 0) {
          // Only handle message if mappings exist
          this.handleNoteOff(note);
        }
        break;
      }
      default:
        break;
    }
  }

  handleNoteOn(note, velocity) {
    // Find closest note with assigned sound and play with adjusted playback rate
    const closestNote = Object.keys(this.props.midiMappings.notes).reduce((prev, curr) =>
      (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
    const soundID = this.props.midiMappings.notes[closestNote];
    const semitonesDelta = note - closestNote;
    const playbackRate = Math.pow(2, (semitonesDelta / 12));
    const sourceNodeKey = `node_${note}`;
    if (soundID) {
      if (velocity > 0) {  // Some midi sources implement noteoff with velocity = 0
        this.props.playAudio(soundID, { playbackRate }, sourceNodeKey);
      } else {
        this.handleNoteOff(note);
      }
    }
  }

  handleNoteOff(note) {
    const closestNote = Object.keys(this.props.midiMappings.notes).reduce((prev, curr) =>
      (Math.abs(curr - note) < Math.abs(prev - note) ? curr : prev));
    const soundID = this.props.midiMappings.notes[closestNote];
    const sourceNodeKey = `node_${note}`;
    this.props.stopAudio(soundID, sourceNodeKey);
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => state.midi;

MIDI.propTypes = propTypes;
export default connect(mapStateToProps, {
  displaySystemMessage,
  setIsMidiLearningSoundID,
  addMidiNoteMapping,
  playAudio,
  stopAudio,
  setLatestReceivedMidiMessage,
})(MIDI);
