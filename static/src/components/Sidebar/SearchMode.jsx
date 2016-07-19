import React from 'react';
import QueryBox from '../QueryBox';
import '../../stylesheets/Sidebar.scss';

function SearchMode(props) {
  return (
    <div className="mode-controls-wrapper">
      <QueryBox {...props} />
    </div>
  );
}

export default SearchMode;
