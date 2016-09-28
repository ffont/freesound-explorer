import React from 'react';
import { robustSearch } from 'utils/arrayUtils';
import ModalTitle from '../ModalTitle';
import LoadSessionEntry from './LoadSessionEntry';
import './LoadSessionModal.scss';


const propTypes = {
  userSessions: React.PropTypes.array,
  demoSessions: React.PropTypes.array,
  loadSession: React.PropTypes.func,
  removeSession: React.PropTypes.func,
};

class LoadSessionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      sortBy: '',
      demoSessions: [],
      userSessions: [],
    };
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { demoSessions, userSessions } = nextProps;
    this.setState({ demoSessions, userSessions });
  }

  onSearchInputChange(evt) {
    const searchInput = evt.target.value;
    // show only sessions that match search input
    const userSessions = robustSearch(searchInput, this.props.userSessions);
    const demoSessions = robustSearch(searchInput, this.props.demoSessions);
    this.setState({ userSessions, demoSessions });
  }

  render() {
    return (
      <div className="LoadSessionModal">
        <ModalTitle title="Load session" />
        <div className="LoadSessionModal__inputs">
          <input
            type="search"
            onChange={this.onSearchInputChange}
          />
          <label htmlFor="sort-sessions-by">
            Sort By:
            <select id="sort-sessions-by" />
          </label>
        </div>
        <div className="LoadSessionModal__user-sessions">
          {this.state.userSessions.map(session =>
            <LoadSessionEntry
              key={session.id}
              loadSession={this.props.loadSession}
              session={session}
              removeSession={this.props.removeSession}
            />
          )}
        </div>
        <div className="LoadSessionModal__demo-sessions">
          {this.state.demoSessions.map(session =>
            <LoadSessionEntry
              key={session.id}
              loadSession={this.props.loadSession}
              session={session}
              isDemoSession
            />
          )}
        </div>
      </div>
    );
  }
}

LoadSessionModal.propTypes = propTypes;
export default LoadSessionModal;
