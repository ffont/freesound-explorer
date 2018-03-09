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
  [SIDEBAR_TABS.HOME]: 'fa-cog',
  [SIDEBAR_TABS.SEARCH]: 'fa-search',
  [SIDEBAR_TABS.SPACES]: 'fa-th-large',
  [SIDEBAR_TABS.SOUNDLIST]: 'fa-align-justify',
  [SIDEBAR_TABS.PATHS]: 'fa-exchange',
  [SIDEBAR_TABS.MIDI]: 'fse-icon-synth',
  [SIDEBAR_TABS.INFO]: 'fa-info',
};

const SidebarNavMenu = props => (
  <div className="SidebarNavMenu">
    <div className="SidebarNavMenu__scrollable">
      <nav>
        <ul className="SidebarNavMenu__nav-icons" role="menu">
          {Object.keys(SIDEBAR_TABS).map(tab => (
            <li
              key={tab}
              role="menuitem"
            >
              <button
                onClick={() => props.setSidebarTab(SIDEBAR_TABS[tab])}
                className={(props.activeTab === SIDEBAR_TABS[tab]) ? 'active' : ''}
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
