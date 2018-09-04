import React from 'react';
import PropTypes from 'prop-types';
import { SIDEBAR_TABS, MESSAGE_STATUS } from 'constants';
import './SidebarNavMenu.scss';

const propTypes = {
  activeTab: PropTypes.string,
  setSidebarTab: PropTypes.func,
  displaySystemMessage: PropTypes.func,
  toggleSidebarVisibility: PropTypes.func,
  batchDownloadSelectedOriginals: PropTypes.func,
  bottomArrowPosition: PropTypes.number,
  isSidebarVisible: PropTypes.bool,
  isUserLoggedIn: PropTypes.bool,
  selectedSounds: PropTypes.array,
  sounds: PropTypes.object,
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

const SidebarNavMenu = props => {
  const downloadButtonStyle = {
    display: props.selectedSounds.length > 1 ? 'block' : 'None',
  };
  const downloadButtonSwitch = () => {
    return  props.isUserLoggedIn ?
      props.batchDownloadSelectedOriginals(props.selectedSounds, props.sounds) :
      props.displaySystemMessage('This actions requires logging into freesound.org.', MESSAGE_STATUS.INFO);
  };
  return (
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
            <li style={downloadButtonStyle}>
              <button
                onClick={downloadButtonSwitch}
              >
                <i id="batch-download-icon" className="fa fa-download fa-lg" aria-hidden="true" />
                <p id="sounds-counter">{props.selectedSounds.length}</p>
              </button>
              
            </li>
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
)};

SidebarNavMenu.propTypes = propTypes;
export default SidebarNavMenu;
