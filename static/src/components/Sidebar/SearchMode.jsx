import React from 'react';
import QueryBox from '../QueryBox';
import '../../stylesheets/Sidebar.scss';

function SearchMode(props) {
  return (
    <div className="sidebar-wrapper">
      <QueryBox {...props} />
    </div>
  );
}

export default SearchMode;
