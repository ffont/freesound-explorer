import React from 'react';
import { connect } from 'react-redux';
import { newSession, saveSession, loadSession } from './actions';
import OptionsList, { makeOption } from '../../components/Input/OptionsList';

const getOptions = props => [
  makeOption('file-o', 'new session', () => props.newSession()),
  makeOption('save', 'save session', () => props.saveSession()),
  makeOption('upload', 'restore session', () => props.loadSession()),
];

const propTypes = {
  newSession: React.PropTypes.func,
  saveSession: React.PropTypes.func,
  loadSession: React.PropTypes.func,
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
})(SessionManager);
