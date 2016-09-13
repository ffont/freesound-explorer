import React from 'react';
import { connect } from 'react-redux';
import { newSession, saveSession, loadSession } from './actions';
import OptionsList, { makeOption } from '../../components/Input/OptionsList';
import { displaySystemMessage } from '../MessagesBox/actions';
import { MESSAGE_STATUS } from '../../constants';

const displayErrorMessage = displayMessage =>
  displayMessage('Feature not implemented yet :( (coming soon)', MESSAGE_STATUS.ERROR);

const getOptions = props => [
  makeOption('file-o', 'new session', () => displayErrorMessage(props.displaySystemMessage)),
  makeOption('save', 'save session', () => displayErrorMessage(props.displaySystemMessage)),
  makeOption('upload', 'restore session', () => displayErrorMessage(props.displaySystemMessage)),
];

const propTypes = {
  newSession: React.PropTypes.func,
  saveSession: React.PropTypes.func,
  loadSession: React.PropTypes.func,
  displaySystemMessage: React.PropTypes.func,
};

const SessionManager = props => (
  <div>
    <OptionsList options={getOptions(props)} />
  </div>
);

SessionManager.propTypes = propTypes;
export default connect(() => ({}), {
  newSession,
  saveSession,
  loadSession,
  displaySystemMessage,
})(SessionManager);
