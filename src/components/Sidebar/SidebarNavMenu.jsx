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
  <div className="SidebarNavMenu">
    <div className="SidebarNavMenu__scrollable">
      <nav>
        <ul role="menu">
          {Object.keys(SIDEBAR_TABS).map(tab => (
            <li
              className={(props.activeTab === SIDEBAR_TABS[tab]) ? 'active' : ''}
              key={tab}
              role="menuitem"
            >
              <button
                onClick={() => props.setSidebarTab(SIDEBAR_TABS[tab])}
              >
                <i className={`fa ${icons[SIDEBAR_TABS[tab]]} fa-lg`} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="SidebarNavMenu__toggle-button"
        onClick={() => props.toggleSidebarVisibility()}
        style={{ bottom: props.bottomArrowPosition }}
        aria-label="close"
      >
        {(props.isSidebarVisible) ?
          <i className="fa fa-arrow-left" aria-hidden /> :
          <i className="fa fa-arrow-right" aria-hidden />
        }
      </button>
    </div>
  </div>
);

SidebarNavMenu.propTypes = propTypes;
export default SidebarNavMenu;
