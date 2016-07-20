import React from 'react';
import QueryBox from './QueryBox';
import '../../stylesheets/Sidebar.scss';

function SearchMode(props) {
  return (
    <QueryBox {...props} />
  );
}

export default SearchMode;
