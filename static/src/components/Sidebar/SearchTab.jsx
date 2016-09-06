import React from 'react';
import QueryBox from './QueryBox';
import baseTab from './BaseTab';

function SearchTab() {
  return (
    <div>
      <QueryBox />
    </div>
  );
}

export default baseTab('Search', SearchTab);
