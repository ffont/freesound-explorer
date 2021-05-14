import PropTypes from 'prop-types';
import SessionManager from 'containers/SessionsHandler/SessionManager';
import SettingsContainer from 'containers/Settings/SettingsContainer';
import baseTab from './BaseTab';

const propTypes = {
  shouldPlayOnHover: PropTypes.bool,
  togglePlayOnHover: PropTypes.func,
};

const HomeTab = () => (
  <div>
    <SessionManager />
    <SettingsContainer />
  </div>
);

HomeTab.propTypes = propTypes;
export default baseTab('Settings', HomeTab);
