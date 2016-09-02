import React from 'react';
import { connect } from 'react-redux';
import { toggleSidebarVisibility, setSidebarTab } from '../../actions/sidebar';
import HomeTab from './HomeTab';
import SearchTab from './SearchTab';
import PathsTab from './PathsTab';
import SpacesTab from './SpacesTab';
import MidiTab from './MidiTab';
import InfoTab from './InfoTab';
import Metronome from '../Metronome';
import { SIDEBAR_TABS } from '../../constants';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  activeTab: React.PropTypes.string,
  bottomArrowPosition: React.PropTypes.number,
  toggleSidebarVisibility: React.PropTypes.func,
  setSidebarTab: React.PropTypes.func,
};

const icons = {
  [SIDEBAR_TABS.HOME]: 'fa-home',
  [SIDEBAR_TABS.SEARCH]: 'fa-search',
  [SIDEBAR_TABS.SPACES]: 'fa-object-group',
  [SIDEBAR_TABS.PATHS]: 'fa-exchange',
  [SIDEBAR_TABS.MIDI]: 'fa-keyboard-o',
  [SIDEBAR_TABS.INFO]: 'fa-info',
};

const getSidebarContent = (activeTab) => {
  switch (activeTab) {
    case SIDEBAR_TABS.HOME:
      return <HomeTab />;
    case SIDEBAR_TABS.SEARCH:
      return <SearchTab />;
    case SIDEBAR_TABS.PATHS:
      return <PathsTab />;
    case SIDEBAR_TABS.SPACES:
      return <SpacesTab />;
    case SIDEBAR_TABS.MIDI:
      return <MidiTab />;
    case SIDEBAR_TABS.INFO:
      return <InfoTab />;
    default:
      return <SearchTab />;
  }
};

function Sidebar(props) {
  const sidebarClassName = `sidebar${(props.isVisible) ? ' active' : ''}`;
  const sideBarContent = getSidebarContent(props.activeTab);
  return (
    <aside>
      <div className={sidebarClassName}>
        <div className="sidebar-content-wrapper">
          {sideBarContent}
        </div>
        <Metronome />
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
                  <i className={`fa ${icons[SIDEBAR_TABS[tab]]} fa-lg`} aria-hidden="true" />
                </button>
              </li>
            ))}
            </ol>
          </nav>
          <div
            className="toggle-visibility-button"
            onClick={() => props.toggleSidebarVisibility(!props.isVisible)}
            style={{ bottom: props.bottomArrowPosition }}
          >
            {(props.isVisible) ?
              <i className="fa fa-arrow-left" aria-hidden="true" /> :
              <i className="fa fa-arrow-right" aria-hidden="true" />
            }
          </div>
        </div>
      </div>
    </aside>
  );
}

const mapStateToProps = (state) => state.sidebar;

Sidebar.propTypes = propTypes;
export default connect(mapStateToProps, {
  toggleSidebarVisibility,
  setSidebarTab,
})(Sidebar);
