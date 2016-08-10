import React from 'react';
import PathsList from '../Paths/PathsList';
import Metronome from '../Metronome';

const propTypes = {
  isActiveMode: React.PropTypes.bool,
  audioContext: React.PropTypes.object,
};

function PathsMode(props) {
  return (
    <div className={(props.isActiveMode) ? 'mode-active' : 'mode-inactive'}>
      <h1>Paths</h1>
      <Metronome audioContext={props.audioContext} />
      <PathsList {...props} />
    </div>
  );
}

PathsMode.propTypes = propTypes;
export default PathsMode;
