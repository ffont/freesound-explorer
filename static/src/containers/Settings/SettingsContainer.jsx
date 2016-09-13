import React from 'react';
import { connect } from 'redux';
import { togglePlayOnHover } from './actions';
import CheckBox from '../../components/Input/CheckBox';

const propTypes = {
  shouldPlayOnHover: React.PropTypes.bool,
  togglePlayOnHover: React.PropTypes.func,
};

const SettingsContainer = props => (
  <CheckBox
    checked={props.shouldPlayOnHover}
    onChange={props.togglePlayOnHover}
    label="Play on hover"
    tabIndex="0"
  />
);

SettingsContainer.propTypes = propTypes;
const mapStateToProps = state => state.settings;
export default connect(mapStateToProps, { togglePlayOnHover })(SettingsContainer);
