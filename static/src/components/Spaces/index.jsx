import React from 'react';
import MapCircleContainer from '../../containers/Sounds/MapCircleContainer';

const propTypes = {
  sounds: React.PropTypes.array,
  isThumbnail: React.PropTypes.bool,
};

const defaultProps = {
  isThumbnail: false,
};

class Space extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.sounds !== this.props.sounds;
  }

  render() {
    return (<g>
      {this.props.sounds.map((soundID, soundIdx) => (
        <MapCircleContainer
          key={soundIdx}
          soundID={soundID}
          isThumbnail={this.props.isThumbnail}
        />
      ))}
    </g>);
  }
}

Space.propTypes = propTypes;
Space.defaultProps = defaultProps;
export default Space;
