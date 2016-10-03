import React from 'react';
import { connect } from 'react-redux';
import MidiMapping from './MidiMapping';

const propTypes = {
  notesMapped: React.PropTypes.object,
  isMidiSupported: React.PropTypes.bool,
};

class MidiMappingsList extends React.Component {

  getMappingsList() {
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

  render() {
    const mappingsList = (this.props.isMidiSupported) ? this.getMappingsList() : null;
    return mappingsList;
  }
}

const mapStateToProps = (state) => {
  const { notesMapped, isMidiSupported } = state.midi;
  return { notesMapped, isMidiSupported };
};

MidiMappingsList.propTypes = propTypes;
export default connect(mapStateToProps, {})(MidiMappingsList);
