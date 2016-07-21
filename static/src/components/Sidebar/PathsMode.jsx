import React from 'react';
import PathsList from './PathsList';

const propTypes = {
  isActiveMode: React.PropTypes.bool,
  paths: React.PropTypes.array,
};

function PathsMode(props) {
  return (
    <div className={(props.isActiveMode) ? 'mode-active' : 'mode-inactive'}>
      <h1>Paths</h1>
      <PathsList paths={props.paths} />
    </div>
  );
}

PathsMode.propTypes = propTypes;
export default PathsMode;
