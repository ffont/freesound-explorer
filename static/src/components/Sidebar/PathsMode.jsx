import React from 'react';
import PathsList from './PathsList';

const propTypes = {
  isActiveMode: React.PropTypes.bool,
};

function PathsMode(props) {
  return (
    <div className={(props.isActiveMode) ? 'mode-active' : 'mode-inactive'}>
      <h1>Paths</h1>
      <PathsList {...props} />
    </div>
  );
}

PathsMode.propTypes = propTypes;
export default PathsMode;
