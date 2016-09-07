import React from 'react';
import { connect } from 'react-redux';
import { toggleSidebarVisibility, setSidebarTab } from '../../actions/sidebar';
import HomeTab from './HomeTab';
import SearchTab from './SearchTab';
import PathsTab from './PathsTab';
import SpacesTab from './SpacesTab';
import MidiTab from './MidiTab';
import InfoTab from './InfoTab';
import { SIDEBAR_TABS, START_METRONOME_AT_MOUNT } from '../../constants';
import { startMetronome, setStartedMetronomeAtMount } from '../../actions/metronome';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  activeTab: React.PropTypes.string,
  bottomArrowPosition: React.PropTypes.number,
  toggleSidebarVisibility: React.PropTypes.func,
  setSidebarTab: React.PropTypes.func,
  startMetronome: React.PropTypes.func,
  setStartedMetronomeAtMount: React.PropTypes.func,
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

class Sidebar extends React.Component {
  componentDidMount() {
    if ((START_METRONOME_AT_MOUNT) && (!this.props.startedMetronomeAtMount)) {
      this.props.setStartedMetronomeAtMount(true);
      this.props.startMetronome();
    }
  }
  render() {
    const sidebarClassName = `sidebar${(this.props.isVisible) ? ' active' : ''}`;
    const sideBarContent = getSidebarContent(this.props.activeTab);
    return (
      <aside>
        <div className={sidebarClassName}>
          <div className="sidebar-content-wrapper">
            {sideBarContent}
          </div>
          <div className="sidebar-menu-wrapper">
            <nav>
              <ol>
              {Object.keys(SIDEBAR_TABS).map(tab => (
                <li
                  className={(this.props.activeTab === SIDEBAR_TABS[tab]) ? 'active' : ''}
                  onClick={() => this.props.setSidebarTab(SIDEBAR_TABS[tab])}
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
              onClick={() => this.props.toggleSidebarVisibility(!this.props.isVisible)}
              style={{ bottom: this.props.bottomArrowPosition }}
            >
              {(this.props.isVisible) ?
                <i className="fa fa-arrow-left" aria-hidden="true" /> :
                <i className="fa fa-arrow-right" aria-hidden="true" />
              }
            </div>
          </div>
        </div>
      </aside>
    );
  }
}

const mapStateToProps = (state) => state.sidebar;

Sidebar.propTypes = propTypes;
export default connect(mapStateToProps, {
  toggleSidebarVisibility,
  setSidebarTab,
  startMetronome,
  setStartedMetronomeAtMount,
})(Sidebar);
