import React from 'react';
import SessionManager from 'containers/SessionsHandler/SessionManager.jsx';
import SettingsContainer from 'containers/Settings/SettingsContainer.jsx';
import MetronomeContainer from 'containers/Metronome/MetronomeContainer.jsx';
import baseTab from './BaseTab';

const propTypes = {
  shouldPlayOnHover: React.PropTypes.bool,
  togglePlayOnHover: React.PropTypes.func,
};

const HomeTab = () => (
  <div>
    <SessionManager />
    <SettingsContainer />
    <MetronomeContainer />
  </div>
);

HomeTab.propTypes = propTypes;
export default baseTab('Home', HomeTab);
