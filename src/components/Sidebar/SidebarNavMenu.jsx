import React from 'react';
import { SIDEBAR_TABS } from 'constants';

const propTypes = {
  activeTab: React.PropTypes.string,
  setSidebarTab: React.PropTypes.func,
  toggleSidebarVisibility: React.PropTypes.func,
  bottomArrowPosition: React.PropTypes.number,
  isSidebarVisible: React.PropTypes.bool,
};

const icons = {
  [SIDEBAR_TABS.HOME]: 'fa-home',
  [SIDEBAR_TABS.SEARCH]: 'fa-search',
  [SIDEBAR_TABS.SPACES]: 'fa-object-group',
  [SIDEBAR_TABS.PATHS]: 'fa-exchange',
  [SIDEBAR_TABS.MIDI]: 'fa-keyboard-o',
  [SIDEBAR_TABS.INFO]: 'fa-info',
};

const SidebarNavMenu = props => (
  <div className="sidebar-menu-wrapper">
    <nav>
      <ol>
      {Object.keys(SIDEBAR_TABS).map(tab => (
        <li
          className={(props.activeTab === SIDEBAR_TABS[tab]) ? 'active' : ''}
          onClick={() => props.setSidebarTab(SIDEBAR_TABS[tab])}
          key={tab}
        >
          <button>
            <i className={`fa ${icons[SIDEBAR_TABS[tab]]} fa-lg`} aria-hidden />
          </button>
        </li>
      ))}
      </ol>
    </nav>
    <div
      className="toggle-visibility-button"
      onClick={() => props.toggleSidebarVisibility()}
      style={{ bottom: props.bottomArrowPosition }}
    >
      {(props.isSidebarVisible) ?
        <i className="fa fa-arrow-left" aria-hidden /> :
        <i className="fa fa-arrow-right" aria-hidden />
      }
    </div>
  </div>
);

SidebarNavMenu.propTypes = propTypes;
export default SidebarNavMenu;
