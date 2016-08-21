import React from 'react';
import { connect } from 'react-redux';
import { DEFAULT_RADIUS, DEFAULT_FILL_OPACITY, DEFAULT_STROKE_WIDTH, DEFAULT_STROKE_OPACITY }
  from '../../constants';

const propTypes = {
  sound: React.PropTypes.object,
};


class MapCircle extends React.Component {
  render() {
    if (!this.props.sound.position) {
      return null;
    }
    const { cx, cy } = this.props.sound.position;
    const fillColor = this.props.sound.color;
    const strokeColor = this.props.sound.color;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={DEFAULT_RADIUS / 2}
        fill={fillColor}
        fillOpacity={DEFAULT_FILL_OPACITY}
        stroke={strokeColor}
        strokeWidth={DEFAULT_STROKE_WIDTH}
        strokeOpacity={DEFAULT_STROKE_OPACITY}
        onMouseEnter={this.onHoverCallback}
        onMouseLeave={this.onMouseLeaveCallback}
        onClick={this.onClickCallback}
      />
    );
  }
}

const makeMapStateToProps = (_, ownProps) => {
  const { soundID } = ownProps;
  return (state) => {
    const sound = state.sounds.byID[soundID];
    return {
      sound,
    };
  };
};

MapCircle.propTypes = propTypes;
export default connect(makeMapStateToProps, {})(MapCircle);
