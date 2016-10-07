import React from 'react';
import { connect } from 'react-redux';
import LoadSessionModal from 'components/Modal/LoadSession/LoadSessionModal';
import { loadSession, removeSession, getAvailableSessions } from '../SessionsHandler/actions';

const propTypes = {
  loadSession: React.PropTypes.func,
  removeSession: React.PropTypes.func,
  getAvailableSessions: React.PropTypes.func,
  availableUserSessions: React.PropTypes.array,
  availableDemoSessions: React.PropTypes.array,
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
