import React from 'react';
import { connect } from 'react-redux';
import { midiNoteNumberToMidiNoteLabel } from '../../utils/midiUtils';
import { removeMidiNoteMapping } from '../../actions/midi';

const propTypes = {
  midiNote: React.PropTypes.string,
  soundID: React.PropTypes.string,
  sound: React.PropTypes.object,
  removeMidiNoteMapping: React.PropTypes.func,
};

function MidiMapping(props) {
  return (
    <li>
      {midiNoteNumberToMidiNoteLabel(props.midiNote)} ({props.midiNote}), {props.sound.name}
      <i
        className="fa fa-lg fa-times-circle-o"
        aria-hidden
        onClick={(evt) => {
          evt.stopPropagation();
          props.removeMidiNoteMapping(props.midiNote);
        }}
      />
    </li>
  );
}


const makeMapStateToProps = (_, ownProps) => {
  const { soundID } = ownProps;
  return (state) => {
    const sound = state.sounds.byID[soundID];
    return {
      sound,
    };
  };
};

MidiMapping.propTypes = propTypes;
export default connect(makeMapStateToProps, {
  removeMidiNoteMapping,
})(MidiMapping);
