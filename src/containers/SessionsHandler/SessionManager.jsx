import PropTypes from 'prop-types';
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
  /** option "Save as", that opens new modal */
  const saveAsOption = makeOption('save', 'save session as', () =>
    props.setModalPage(MODAL_PAGES.SAVE_SESSION));
  /** option "Save", that overrides current saved session.
  It should be available only if session is already saved */
  const isSaveEnabled = !props.currentSessionID;
  const saveNewOption = makeOption('save', 'save session',
    () => props.saveSession(), isSaveEnabled);
  return [saveNewOption, saveAsOption];
};

const getOptions = props => [
  newSessionOption(props),
  ...saveSessionOptions(props),
  makeOption('upload', 'load session', () =>
    props.setModalPage(MODAL_PAGES.LOAD_SESSION)),
];

const propTypes = {
  newSession: PropTypes.func,
  saveSession: PropTypes.func,
  setModalPage: PropTypes.func,
  currentSessionID: PropTypes.string,
  hasUnsavedProgress: PropTypes.bool,
};

const SessionManager = props => (
  <div>
    <OptionsList options={getOptions(props)} />
  </div>
);

const mapStateToProps = state => ({
  hasUnsavedProgress: state.session.hasUnsavedProgress,
  currentSessionID: state.session.id,
});

SessionManager.propTypes = propTypes;
export default connect(mapStateToProps, {
  newSession,
  saveSession,
  setModalPage,
})(SessionManager);
