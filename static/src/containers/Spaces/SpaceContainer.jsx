import React from 'react';
import { connect } from 'react-redux';
import MapCircleContainer from '../Sounds/MapCircleContainer';

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

const makeMapStateToProps = (_, ownProps) => {
  const { queryID, isThumbnail } = ownProps;
  return (state) => {
    const space = state.spaces.spaces.find(curSpace =>
      curSpace.queryID === queryID);
    return Object.assign({ queryID, isThumbnail }, space);
  };
};

Space.propTypes = propTypes;
Space.defaultProps = defaultProps;
export default connect(makeMapStateToProps, {})(Space);
