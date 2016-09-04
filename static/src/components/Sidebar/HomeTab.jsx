import React from 'react';
import { connect } from 'react-redux';
import { togglePlayOnHover } from '../../actions/settings';
import { newSession, saveSession, loadSession } from '../../actions/sessions';
import baseTab from './BaseTab';
import CheckBox from '../Input/CheckBox';
import OptionsList, { makeOption } from '../Input/OptionsList';

const propTypes = {
  playOnHover: React.PropTypes.bool,
  togglePlayOnHover: React.PropTypes.func,
};

const getOptions = (props) => [
  makeOption('file-o', 'new session', () => props.newSession()),
  makeOption('save', 'save session', () => props.saveSession()),
  makeOption('upload', 'restore session', () => props.loadSession()),
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
})(baseTab('Home', HomeTab));
