import React from 'react';

const propTypes = {
  paths: React.PropTypes.array,
};

function PathsList(props) {
  return (
    <ul>
      {props.paths.map((path, index) =>
        <li key={index}>{path.name}, {path.sounds.length} sounds</li>
      )}
    </ul>
  );
}


PathsList.propTypes = propTypes;
export default PathsList;
