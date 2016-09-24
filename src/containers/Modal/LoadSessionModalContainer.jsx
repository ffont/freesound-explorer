import React from 'react';
import { connect } from 'react-redux';
import { loadJSON } from 'utils/requests';
import LoadSessionModal from 'components/Modal/LoadSessionModal';
import { URLS } from 'constants';
import { loadSession } from '../SessionsHandler/actions';

const propTypes = {
  loadSession: React.PropTypes.func,
};

class LoadSessionModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { availableSessions: [], userID: '' };
  }

  componentWillMount() {
    loadJSON(URLS.AVAILABLE_SESSIONS).then((response) => {
      this.setState({
        availableSessions: response.userSessions,
        userID: `${response.userID}`,
      });
    });
  }

  render() {
    return (
      <LoadSessionModal
        sessions={this.state.availableSessions}
        loadSession={this.props.loadSession}
        userID={this.state.userID}
      />
    );
  }
}


LoadSessionModalContainer.propTypes = propTypes;
export default connect(() => ({}), { loadSession })(LoadSessionModalContainer);
