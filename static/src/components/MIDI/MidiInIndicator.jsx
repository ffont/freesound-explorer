import React from 'react';
import { connect } from 'react-redux';
import { MIDI_MESSAGE_INDICATOR_DURATION } from '../../constants';
import '../../stylesheets/Midi.scss';

const propTypes = {
  latestReceivedMessages: React.PropTypes.array,
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

  render() {
    let message;
    if ((this.props.latestReceivedMessages) && !(this.lastMessageIdOld)) {
      message = this.props.latestReceivedMessages[0];
    }
    return (
      <div>
      { (message) ?
        message.note : '-'
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { latestReceivedMessages } = state.midi;
  return { latestReceivedMessages };
};

MidiInIndicator.propTypes = propTypes;
export default connect(mapStateToProps, {
})(MidiInIndicator);
