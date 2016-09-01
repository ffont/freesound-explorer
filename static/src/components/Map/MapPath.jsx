import React from 'react';
import { connect } from 'react-redux';
import { DEFAULT_PATH_STROKE_WIDTH, DEFAULT_PATH_STROKE_OPACITY } from '../../constants';

const propTypes = {
  path: React.PropTypes.object,
  sounds: React.PropTypes.object,
};

class MapPath extends React.Component {
  shouldComponentUpdate(nextProps) {
    // TODO: optimize this
    return true;
  }

  render() {
    if (!this.props.path.sounds.length) {
      return null;
    }
    return (<g>
      {[...Array(this.props.path.sounds.length - 1).keys()].map((soundID, index) => {
        const soundFrom = this.props.sounds[this.props.path.sounds[index]];
        const soundTo = this.props.sounds[this.props.path.sounds[index + 1]];
        return (
          <line
            key={index}
            x1={soundFrom.position.cx}
            y1={soundFrom.position.cy}
            x2={soundTo.position.cx}
            y2={soundTo.position.cy}
            stroke="white"
            strokeWidth={DEFAULT_PATH_STROKE_WIDTH}
            strokeOpacity={(this.props.path.isPlaying) ?
              DEFAULT_PATH_STROKE_OPACITY * 10 :
              DEFAULT_PATH_STROKE_OPACITY}
          />
        );
      })}
    </g>);
  }
}

const mapStateToProps = (state) => {
  const sounds = state.sounds.byID;
  return { sounds };
};

MapPath.propTypes = propTypes;

export default connect(mapStateToProps, {})(MapPath);
