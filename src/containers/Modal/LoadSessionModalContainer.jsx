import React from 'react';
import { connect } from 'react-redux';
import { loadJSON } from 'utils/requests';
import LoadSessionModal from 'components/Modal/LoadSession/LoadSessionModal';
import { URLS } from 'constants';
import { loadSession } from '../SessionsHandler/actions';

const propTypes = {
  loadSession: React.PropTypes.func,
};

class LoadSessionModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { demoSessions: [], availableSessions: [], userID: '' };
  }

  componentWillMount() {
    loadJSON(URLS.AVAILABLE_SESSIONS).then((response) => {
      this.setState({
        availableSessions: response.userSessions,
        demoSessions: response.demoSessions,
        userID: `${response.userID}`,
      });
    });
  }

  render() {
    return (
      <LoadSessionModal
        userSessions={this.state.availableSessions}
        demoSessions={this.state.demoSessions}
        loadSession={this.props.loadSession}
        deleteSession={() => { console.log('delete session'); }}
      />
    );
  }
}


LoadSessionModalContainer.propTypes = propTypes;
export default connect(() => ({}), { loadSession })(LoadSessionModalContainer);
