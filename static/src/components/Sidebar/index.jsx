import React from 'react';
import SearchMode from './SearchMode';
import PathsMode from './PathsMode';
import InfoMode from './InfoMode';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  activeMode: React.PropTypes.string,
  setSidebarVisibility: React.PropTypes.func,
  setActiveMode: React.PropTypes.func,
  audioContext: React.PropTypes.object,
  sounds: React.PropTypes.array,
  playSoundByFreesoundId: React.PropTypes.func,
};

function Sidebar(props) {
  const sidebarClassName = `sidebar${(props.isVisible) ? ' active' : ''}`;
  return (
    <div className={sidebarClassName}>
      <div className="sidebar-content-wrapper">
        <div className="sidebar-vertical-scroll">
          <SearchMode {...props} isActiveMode={props.activeMode === 'SearchMode'} />
          <PathsMode {...props} isActiveMode={props.activeMode === 'PathsMode'} />
          <InfoMode isActiveMode={props.activeMode === 'InfoMode'} />
        </div>
      </div>
      <div className="sidebar-menu-wrapper">
        <ul>
          <li
            className={(props.activeMode === 'SearchMode') ? 'active' : ''}
            onClick={() => props.setActiveMode('SearchMode')}
          ><i className="fa fa-search fa-lg" aria-hidden="true" /></li>
          <li
            className={(props.activeMode === 'PathsMode') ? 'active' : ''}
            onClick={() => props.setActiveMode('PathsMode')}
          ><i className="fa fa-exchange fa-lg" aria-hidden="true" /></li>
          <li
            className={(props.activeMode === 'InfoMode') ? 'active' : ''}
            onClick={() => props.setActiveMode('InfoMode')}
          ><i className="fa fa-info fa-lg" aria-hidden="true" /></li>
        </ul>
        <div
          className="toggle-visibility-button"
          onClick={() => props.setSidebarVisibility(!props.isVisible)}
        >
          {(props.isVisible) ?
            <i className="fa fa-arrow-left" aria-hidden="true" /> :
            <i className="fa fa-arrow-right" aria-hidden="true" />
          }
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = propTypes;
export default Sidebar;
