import React from 'react';
import PropTypes from 'prop-types';
import { robustSearch } from 'utils/arrayUtils';
import ModalTitle from '../ModalTitle';
import LoadSessionEntry from './LoadSessionEntry';
import './LoadSessionModal.scss';


const propTypes = {
  userSessions: PropTypes.array,
  demoSessions: PropTypes.array,
  loadSession: PropTypes.func,
  removeSession: PropTypes.func,
};

class LoadSessionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      sortBy: '',
      demoSessions: [],
      userSessions: [],
      isInputFocused: false,
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
    const inputContainerClass = (this.state.isInputFocused) ?
      'LoadSessionModal__inputs--search__container focus' :
      'LoadSessionModal__inputs--search__container';
    return (
      <div className="LoadSessionModal">
        <ModalTitle title="Load session" />
        <div className="LoadSessionModal__inputs">
          <div className={inputContainerClass}>
            <input
              type="search"
              onChange={this.onSearchInputChange}
              className="LoadSessionModal__inputs--search"
              onFocus={() => this.setState({ isInputFocused: true })}
              onBlur={() => this.setState({ isInputFocused: false })}
              onKeyDown={(evt) => evt.stopPropagation()}
            />
            <i className="fa fa-search LoadSessionModal__inputs--search__icon" />
          </div>
        </div>
        {(this.state.userSessions.length) ? (
          <section className="LoadSessionModal__user-sessions">
            <div className="LoadSessionModal__sessions-table">
              {/** <div className="LoadSessionModal__sessions-table_8">Name</div>
              <div className="LoadSessionModal__sessions-table_3">Date</div>
              <div className="LoadSessionModal__sessions-table_1">Delete</div>*/}
              {this.state.userSessions.map(session =>
                <LoadSessionEntry
                  key={session.id}
                  loadSession={this.props.loadSession}
                  session={session}
                  removeSession={this.props.removeSession}
                />
              )}
            </div>
          </section>) : null}
        {(this.state.demoSessions.length) ? (
          <section className="LoadSessionModal__demo-sessions">
            <header className="LoadSessionModal__section-header">Examples</header>
            {this.state.demoSessions.map(session =>
              <LoadSessionEntry
                key={session.id}
                loadSession={this.props.loadSession}
                session={session}
                isDemoSession
              />
            )}
          </section>) : null}
      </div>
    );
  }
}

LoadSessionModal.propTypes = propTypes;
export default LoadSessionModal;
