import React from 'react';
import QueryBox from './QueryBox';

function SearchTab(props) {
  return (
    <div>
      <header><h1>Search</h1></header>
      <QueryBox {...props} />
    </div>
  );
}

export default SearchTab;
