import React from 'react';
import SearchMode from './SearchMode';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
};

function Sidebar(props) {
  const sidebarClassName = `sidebar${(props.isVisible) ? ' active' : ''}`;
  return (
    <div className={sidebarClassName}>
      <SearchMode {...props} />
    </div>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
