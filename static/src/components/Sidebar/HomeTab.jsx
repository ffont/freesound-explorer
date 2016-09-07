import React from 'react';
import { connect } from 'react-redux';
import { togglePlayOnHover } from '../../actions/settings';
import { displaySystemMessage } from '../../actions/messagesBox';
import { newSession, saveSession, loadSession } from '../../actions/sessions';
import baseTab from './BaseTab';
import CheckBox from '../Input/CheckBox';
import OptionsList, { makeOption } from '../Input/OptionsList';
import Metronome from '../Metronome';
import { MESSAGE_STATUS } from '../../constants';

const propTypes = {
  playOnHover: React.PropTypes.bool,
  togglePlayOnHover: React.PropTypes.func,
};

const displayErrorMessage = (displayMessage) =>
  displayMessage('Feature not implemented yet :( (coming soon)', MESSAGE_STATUS.ERROR);

const getOptions = (props) => [
  makeOption('file-o', 'new session', () => displayErrorMessage(props.displaySystemMessage)),
  makeOption('save', 'save session', () => displayErrorMessage(props.displaySystemMessage)),
  makeOption('upload', 'restore session', () => displayErrorMessage(props.displaySystemMessage)),
];

function HomeTab(props) {
  return (
    <div>
      <OptionsList options={getOptions(props)} />
      <CheckBox
        checked={props.playOnHover}
        onChange={props.togglePlayOnHover}
        label="Play on hover"
        tabIndex="6"
      />
      <Metronome />
    </div>
  );
}

const mapStateToProps = (state) => state.settings;

HomeTab.propTypes = propTypes;
export default connect(mapStateToProps, {
  togglePlayOnHover,
  newSession,
  saveSession,
  loadSession,
  displaySystemMessage,
})(baseTab('Home', HomeTab));
