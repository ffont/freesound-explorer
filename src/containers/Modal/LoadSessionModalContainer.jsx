import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadSessionModal from 'components/Modal/LoadSession/LoadSessionModal';
import { loadSession, removeSession, getAvailableSessions } from '../SessionsHandler/actions';

const propTypes = {
  loadSession: PropTypes.func,
  removeSession: PropTypes.func,
  getAvailableSessions: PropTypes.func,
  availableUserSessions: PropTypes.array,
  availableDemoSessions: PropTypes.array,
};

class LoadSessionModalContainer extends React.Component {

  componentWillMount() {
    this.props.getAvailableSessions();
  }

  render() {
    return (
      <LoadSessionModal
        userSessions={this.props.availableUserSessions}
        demoSessions={this.props.availableDemoSessions}
        loadSession={this.props.loadSession}
        removeSession={this.props.removeSession}
      />
    );
  }
}

const mapStateToProps = state => ({
  availableUserSessions: state.session.availableUserSessions,
  availableDemoSessions: state.session.availableDemoSessions,
});

LoadSessionModalContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  loadSession,
  removeSession,
  getAvailableSessions,
})(LoadSessionModalContainer);
