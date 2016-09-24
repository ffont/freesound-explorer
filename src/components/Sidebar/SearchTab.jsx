import React from 'react';
import SearchContainer from 'containers/Search/SearchContainer.jsx';
import baseTab from './BaseTab';
import './SearchTab.scss';

function SearchTab() {
  return (
    <div>
      <SearchContainer />
    </div>
  );
}

export default baseTab('Search', SearchTab);
