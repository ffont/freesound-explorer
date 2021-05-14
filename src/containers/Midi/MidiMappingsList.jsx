import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MidiMapping from './MidiMapping';

const propTypes = {
  notesMapped: PropTypes.object,
  isMidiSupported: PropTypes.bool,
};

class MidiMappingsList extends Component {

  getMappingsList() {
    return (
      <div className="midi-list">
        <div className="title-text">Assigned MIDI notes:</div>
        <ul>{this.props.notesMapped.length > 0 ? '' : <li>No MIDI notes have been assigned yet</li>}
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
