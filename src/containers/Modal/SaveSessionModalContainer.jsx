import React from 'react';
import { connect } from 'react-redux';
import SaveSessionModal from 'components/Modal/SaveSessionModal';
import { saveSessionAs } from '../SessionsHandler/actions';

const propTypes = {
  saveSessionAs: React.PropTypes.func,
  currentSessionName: React.PropTypes.string,
};

class LoadSessionModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { availableSessions: [], userID: '' };
  }

  componentWillMount() {
  }

  render() {
    return (
      <SaveSessionModal
        saveSessionAs={this.props.saveSessionAs}
        currentSessionName={this.props.currentSessionName}
      />
    );
  }
}

const mapStateToProps = state => ({ currentSessionName: state.session.name });

LoadSessionModalContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  saveSessionAs,
})(LoadSessionModalContainer);
