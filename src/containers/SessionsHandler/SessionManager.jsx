import React from 'react';
import { connect } from 'react-redux';
import OptionsList, { makeOption } from 'components/OptionsList';
import { MODAL_PAGES } from 'constants';
import { newSession, saveSession } from './actions';
import { setModalPage } from '../Modal/actions';

const newSessionOption = props => makeOption('file-o', 'new session', () => {
  if (props.hasUnsavedProgress) {
    // ask whether the user wants to save progress
    props.setModalPage(MODAL_PAGES.NEW_SESSION);
  } else {
    props.newSession();
  }
});

const saveSessionOptions = (props) => {
  // option "Save as", that opens new modal
  const saveAsOption = makeOption('save', 'save session as', () =>
    props.setModalPage(MODAL_PAGES.SAVE_SESSION));
  // option "Save", that overrides current saved session
  const saveNewOption = makeOption('save', 'save session', () =>
    props.saveSession()
  );
  if (props.currentSessionName) {
    return [saveNewOption, saveAsOption];
  }
  return [saveAsOption];
};

const getOptions = props => [
  newSessionOption(props),
  ...saveSessionOptions(props),
  makeOption('upload', 'restore session', () =>
    props.setModalPage(MODAL_PAGES.LOAD_SESSION)),
];

const propTypes = {
  newSession: React.PropTypes.func,
  saveSession: React.PropTypes.func,
  setModalPage: React.PropTypes.func,
  currentSessionName: React.PropTypes.string,
  hasUnsavedProgress: React.PropTypes.bool,
};

const SessionManager = props => (
  <div>
    <OptionsList options={getOptions(props)} />
  </div>
);

const mapStateToProps = state => ({
  hasUnsavedProgress: state.session.hasUnsavedProgress,
  currentSessionName: state.session.name,
});

SessionManager.propTypes = propTypes;
export default connect(mapStateToProps, {
  newSession,
  saveSession,
  setModalPage,
})(SessionManager);
