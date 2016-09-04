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
      <ul className="midi-list">
        {Object.keys(this.props.midiMappings.notes).map((key, index) =>
          <MidiMapping
            key={index}
            midiNote={key}
            soundID={this.props.midiMappings.notes[key]}
          />
        )}
      </ul>
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
