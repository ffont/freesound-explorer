import React from 'react';
import { connect } from 'react-redux';
import SelectWithLabel from 'components/Input/SelectWithLabel';
import { MIDI_MESSAGE_INDICATOR_DURATION } from 'constants';
import { midiMessageTypeLabel, midiNoteNumberToMidiNoteLabel } from './utils';
import { setMidiInputChannel, setMidiInputDevice, setUpMIDIDevices } from './actions';

const propTypes = {
  latestReceivedMessages: React.PropTypes.array,
  setMidiInputChannel: React.PropTypes.func,
  setMidiInputDevice: React.PropTypes.func,
  inputChannel: React.PropTypes.number,
  inputDevice: React.PropTypes.string,
  setUpMIDIDevices: React.PropTypes.func,
  availableMIDIDevices: React.PropTypes.array,
  isMidiSupported: React.PropTypes.bool,
};

class MidiInIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.visibilityTimeout = undefined;
    this.lastMessageIdOld = false;
  }

  shouldComponentUpdate() {
    this.lastMessageIdOld = false;
    clearTimeout(this.visibilityTimeout);
    this.handleTimedVisibility();
    return true;
  }

  handleTimedVisibility() {
    this.visibilityTimeout = setTimeout(() => {
      this.lastMessageIdOld = true;
      this.forceUpdate();
    }, MIDI_MESSAGE_INDICATOR_DURATION);
  }

  getMIDILatestMessage() {
    let message;
    if ((this.props.latestReceivedMessages) && !(this.lastMessageIdOld)) {
      message = this.props.latestReceivedMessages[0];
    }
    let messageInfo = '';
    if (!message) {
      messageInfo = '-';
    } else {
      switch (midiMessageTypeLabel(message.type)) {
        case 'Note On':
        case 'Note Off': {
          messageInfo =
            `${midiNoteNumberToMidiNoteLabel(message.note)} ${parseInt(message.velocity, 10)}`;
          break;
        }
        default:
          break;
      }
    }
    return (
      <div className="last-message">
        Latest message: { (message) ? midiMessageTypeLabel(message.type) : '' } { messageInfo }
      </div>
    );
  }

  getMIDIControls() {
    return (
      <div className="selectors">
        <SelectWithLabel
          onChange={(evt) => {
            let channelNumber;
            if (evt.target.value !== 'All') {
              channelNumber = parseInt(evt.target.value, 10);
            }
            this.props.setMidiInputChannel(channelNumber);
          }}
          options={[{ value: undefined, name: 'All' },
            { value: '1', name: '1' }, { value: '2', name: '2' },
            { value: '3', name: '3' }, { value: '4', name: '4' },
            { value: '5', name: '5' }, { value: '6', name: '6' },
            { value: '7', name: '7' }, { value: '8', name: '8' },
            { value: '9', name: '9' }, { value: '10', name: '10' },
            { value: '11', name: '11' }, { value: '12', name: '12' },
            { value: '13', name: '13' }, { value: '14', name: '14' },
            { value: '15', name: '15' }, { value: '16', name: '16' }]}
          label="Input channel"
          defaultValue={this.props.inputChannel}
        />
        <SelectWithLabel
          onChange={(evt) => {
            let deviceName;
            if (evt.target.value !== 'All') {
              deviceName = evt.target.value;
            }
            this.props.setMidiInputDevice(deviceName);
          }}
          options={
            [{ value: undefined, name: 'All' },
            ...this.props.availableMIDIDevices.map((device) => (
            { value: device.value.name, name: device.value.name }
          ))]}
          label="Input device"
          defaultValue={this.props.inputDevice}
        />
        <i
          className="fa fa-lg fa-refresh"
          aria-hidden
          onClick={(evt) => {
            evt.stopPropagation();
            this.props.setUpMIDIDevices();
          }}
        />
      </div>
    );
  }

  render() {
    const midiSupportedWarning = (this.props.isMidiSupported) ? null :
      'MIDI input is not supported in your browser. Please use a browser that supports the Web MIDI api.';
    const midiControls = (this.props.isMidiSupported) ? this.getMIDIControls() : null;
    const latestMessage = (this.props.isMidiSupported) ? this.getMIDILatestMessage() : null;
    return (
      <div className="midi-indicator">
        { midiSupportedWarning }
        { midiControls }
        { latestMessage }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { latestReceivedMessages, inputChannel, inputDevice, availableMIDIDevices, isMidiSupported } = state.midi;
  return { latestReceivedMessages,
    inputChannel,
    inputDevice,
    availableMIDIDevices,
    isMidiSupported };
};

MidiInIndicator.propTypes = propTypes;
export default connect(mapStateToProps, {
  setMidiInputChannel,
  setMidiInputDevice,
  setUpMIDIDevices,
})(MidiInIndicator);
