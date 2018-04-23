import React from 'react';
import PropTypes from 'prop-types';
import { SIDEBAR_TABS } from 'constants';
import HomeTab from './HomeTab';
import SearchTab from './SearchTab';
import PathsTab from './PathsTab';
import SpacesTab from './SpacesTab';
import MidiTab from './MidiTab';
import InfoTab from './InfoTab';
import './Sidebar.scss';

const propTypes = {
  activeTab: PropTypes.string,
};

const getContentForActiveTab = (activeTab) => {
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

const SidebarContent = props => (
  <div className="SidebarContent">
    {getContentForActiveTab(props.activeTab)}
  </div>);

SidebarContent.propTypes = propTypes;
export default SidebarContent;
