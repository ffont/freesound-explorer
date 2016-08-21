import React from 'react';
import { connect } from 'react-redux';
import { toggleSidebarVisibility, setSidebarTab } from '../../actions/sidebar';
import SearchMode from './SearchMode';
import PathsMode from './PathsMode';
import InfoMode from './InfoMode';
import { SIDEBAR_TABS } from '../../constants';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  activeTab: React.PropTypes.string,
  toggleSidebarVisibility: React.PropTypes.func,
  setSidebarTab: React.PropTypes.func,
};

function Sidebar(props) {
  const sidebarClassName = `sidebar${(props.isVisible) ? ' active' : ''}`;
  return (
    <div className={sidebarClassName}>
      <div className="sidebar-content-wrapper">
        <div className="sidebar-vertical-scroll">
          <SearchMode {...props} isActiveMode={props.activeTab === SIDEBAR_TABS.SEARCH} />
          <PathsMode {...props} isActiveMode={props.activeTab === SIDEBAR_TABS.PATHS} />
          <InfoMode isActiveMode={props.activeTab === SIDEBAR_TABS.INFO} />
        </div>
      </div>
      <div className="sidebar-menu-wrapper">
        <ul>
          <li
            className={(props.activeTab === SIDEBAR_TABS.SEARCH) ? 'active' : ''}
            onClick={() => props.setSidebarTab(SIDEBAR_TABS.SEARCH)}
          ><i className="fa fa-search fa-lg" aria-hidden="true" /></li>
          <li
            className={(props.activeTab === SIDEBAR_TABS.PATHS) ? 'active' : ''}
            onClick={() => props.setSidebarTab(SIDEBAR_TABS.PATHS)}
          ><i className="fa fa-exchange fa-lg" aria-hidden="true" /></li>
          <li
            className={(props.activeTab === SIDEBAR_TABS.INFO) ? 'active' : ''}
            onClick={() => props.setSidebarTab(SIDEBAR_TABS.INFO)}
          ><i className="fa fa-info fa-lg" aria-hidden="true" /></li>
        </ul>
        <div
          className="toggle-visibility-button"
          onClick={() => props.toggleSidebarVisibility(!props.isVisible)}
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

const mapStateToProps = (state) => state.sidebar;

Sidebar.propTypes = propTypes;
export default connect(mapStateToProps, {
  toggleSidebarVisibility,
  setSidebarTab,
})(Sidebar);
