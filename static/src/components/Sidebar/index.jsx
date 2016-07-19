import React from 'react';
import SearchMode from './SearchMode';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  setSidebarVisibility: React.PropTypes.func,
};

function Sidebar(props) {
  const sidebarClassName = `sidebar${(props.isVisible) ? ' active' : ''}`;
  return (
    <div className={sidebarClassName}>
      <div className="sidebar-content-wrapper">
        <SearchMode {...props} />
      </div>
      <div
        className="sidebar-menu-wrapper"
        onClick={() => props.setSidebarVisibility(!props.isVisible)}
      ></div>
    </div>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
