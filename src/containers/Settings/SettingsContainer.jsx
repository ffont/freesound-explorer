import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CheckBox from 'components/Input/CheckBox';
import { togglePlayOnHover, toggleMetronomeSound } from './actions';

const propTypes = {
  shouldPlayOnHover: PropTypes.bool,
  shouldPlayMetronomeSound: PropTypes.bool,
  togglePlayOnHover: PropTypes.func,
  toggleMetronomeSound: PropTypes.func,
};

const SettingsContainer = props => (
  <div>
    <CheckBox
      checked={props.shouldPlayOnHover}
      onChange={props.togglePlayOnHover}
      label="Play on hover (or hold alt-key)"
      id="play-on-hover-toggle"
    />
    <CheckBox
      checked={props.shouldPlayMetronomeSound}
      onChange={props.toggleMetronomeSound}
      label="Play metronome sound"
      id="play-metronome-toggle"
    />
  </div>
);

SettingsContainer.propTypes = propTypes;
const mapStateToProps = state => state.settings;
export default connect(mapStateToProps, {
  togglePlayOnHover,
  toggleMetronomeSound,
})(SettingsContainer);
