import React from 'react';
import SearchMode from './SearchMode';
import '../../stylesheets/Sidebar.scss';

function Sidebar(props) {
  return (
    <div className="sidebar-wrapper">
      <SearchMode {...props} />
    </div>
  );
}

export default Sidebar;
