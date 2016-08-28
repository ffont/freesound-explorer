import React from 'react';
import { connect } from 'react-redux';
import { togglePlayOnHover } from '../../actions/settings';
import baseTab from './BaseTab';
import CheckBox from '../Input/CheckBox';
import OptionsList, { makeOption } from '../Input/OptionsList';

const propTypes = {
  playOnHover: React.PropTypes.bool,
  togglePlayOnHover: React.PropTypes.func,
};

const options = [
  makeOption('file-o', 'new session', () => console.log('hey')),
  makeOption('save', 'save session'),
  makeOption('upload', 'restore session'),
];

function HomeTab(props) {
  return (
    <div>
      <OptionsList options={options} />
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
export default connect(mapStateToProps, { togglePlayOnHover })(baseTab('Home', HomeTab));
