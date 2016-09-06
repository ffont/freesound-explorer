import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/Midi.scss';
import MidiMapping from './MidiMapping';

const propTypes = {
  midiMappings: React.PropTypes.object,
};

class MidiMappingsList extends React.Component {
  render() {
    return (
      <div className="midi-list">
        <div className="title-text">Assigned MIDI notes:</div>
        <ul>
          {Object.keys(this.props.midiMappings.notes).map((key, index) =>
            <MidiMapping
              key={index}
              midiNote={key}
              soundID={this.props.midiMappings.notes[key]}
            />
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { midiMappings } = state.midi;
  return { midiMappings };
};

MidiMappingsList.propTypes = propTypes;
export default connect(mapStateToProps, {
})(MidiMappingsList);
