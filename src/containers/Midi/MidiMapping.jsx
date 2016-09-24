import React from 'react';
import { connect } from 'react-redux';
import { truncateString } from 'utils/stringUtils';
import { midiNoteNumberToMidiNoteLabel } from './utils';
import { removeMidiNoteMapping } from './actions';
import { selectSound } from '../Sounds/actions';

const propTypes = {
  midiNote: React.PropTypes.string,
  soundID: React.PropTypes.string,
  sound: React.PropTypes.object,
  selectSound: React.PropTypes.func,
  removeMidiNoteMapping: React.PropTypes.func,
};

function MidiMapping(props) {
  return (
    <li>
      <div className="mapping-info">
        {midiNoteNumberToMidiNoteLabel(props.midiNote)} ({props.midiNote})
        <a
          className="cursor-pointer"
          onClick={() => props.selectSound(props.soundID)}
        > {truncateString(props.sound.name, 25)}</a>
      </div>
      <div className="remove-mapping">
        <i
          className="fa fa-lg fa-times-circle-o"
          aria-hidden
          onClick={(evt) => {
            evt.stopPropagation();
            props.removeMidiNoteMapping(props.midiNote);
          }}
        />
      </div>
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
  selectSound,
})(MidiMapping);
