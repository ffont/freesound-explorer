import React from 'react';
import QueryBox from './QueryBox';

const propTypes = {
  isActiveMode: React.PropTypes.bool,
};

function SearchMode(props) {
  return (
    <div className={(props.isActiveMode) ? 'mode-active' : 'mode-inactive'}>
      <h1>Search</h1>
      <QueryBox {...props} />
    </div>
  );
}

SearchMode.propTypes = propTypes;
export default SearchMode;
