import React from 'react';
import { connect } from 'react-redux';
import MidiMapping from './MidiMapping';

const propTypes = {
  notesMapped: React.PropTypes.object,
};

class MidiMappingsList extends React.Component {
  render() {
    return (
      <div className="midi-list">
        <div className="title-text">Assigned MIDI notes:</div>
        <ul>
          {Object.keys(this.props.notesMapped).map((key, index) =>
            <MidiMapping
              key={index}
              midiNote={key}
              soundID={this.props.notesMapped[key]}
            />
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { notesMapped } = state.midi;
  return { notesMapped };
};

MidiMappingsList.propTypes = propTypes;
export default connect(mapStateToProps, {})(MidiMappingsList);
