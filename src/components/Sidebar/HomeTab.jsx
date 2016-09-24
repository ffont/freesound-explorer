import React from 'react';
import baseTab from './BaseTab';
import SessionManager from '../../containers/SessionsHandler/SessionManager';
import SettingsContainer from '../../containers/Settings/SettingsContainer';
import MetronomeContainer from '../../containers/Metronome/MetronomeContainer';

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
