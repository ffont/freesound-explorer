import React from 'react';
import QueryBox from './QueryBox';
import baseTab from './BaseTab';

function SearchTab(props) {
  return (
    <div>
      <QueryBox {...props} />
    </div>
  );
}

export default baseTab('Search', SearchTab);
