import React from 'react';
import SearchMode from './SearchMode';
import InfoMode from './InfoMode';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  activeMode: React.PropTypes.string,
  setSidebarVisibility: React.PropTypes.func,
  setActiveMode: React.PropTypes.func,
};

function Sidebar(props) {
  const sidebarClassName = `sidebar${(props.isVisible) ? ' active' : ''}`;
  return (
    <div className={sidebarClassName}>
      <div className="sidebar-content-wrapper">
        <SearchMode {...props} isActiveMode={props.activeMode === 'SearchMode'} />
        <InfoMode isActiveMode={props.activeMode === 'InfoMode'} />
      </div>
      <div className="sidebar-menu-wrapper">
        <ul>
          <li
            className={(props.activeMode === 'SearchMode') ? 'active' : ''}
            onClick={() => props.setActiveMode('SearchMode')}
          ><i className="fa fa-search fa-lg" aria-hidden="true" /></li>
          <li
            className={(props.activeMode === 'InfoMode') ? 'active' : ''}
            onClick={() => props.setActiveMode('InfoMode')}
          ><i className="fa fa-info fa-lg" aria-hidden="true" /></li>
        </ul>
        <div
          className="toggle-visibility-button"
          onClick={() => props.setSidebarVisibility(!props.isVisible)}
        >
          {(() => {
            switch (props.isVisible) {
              case true: return <i className="fa fa-arrow-left" aria-hidden="true" />;
              default: return <i className="fa fa-arrow-right" aria-hidden="true" />;
            }
          })()}
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
