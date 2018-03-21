import React from 'react';
import { connect } from 'react-redux';
import MapCircleContainer from '../Sounds/MapCircleContainer';
import ClusterTags from '../../components/Spaces/ClusterTags';

const propTypes = {
  sounds: React.PropTypes.array,
  isThumbnail: React.PropTypes.bool,
  clusters: React.PropTypes.array,
  queryID: React.PropTypes.string,
  shouldShowClusterTags: React.PropTypes.bool,
};

const defaultProps = {
  isThumbnail: false,
};

class Space extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.sounds !== this.props.sounds)
      || (nextProps.clusters !== this.props.clusters)
      || nextProps.shouldShowClusterTags !== this.props.shouldShowClusterTags
    );
  }
  render() {
    if (this.props.shouldShowClusterTags && this.props.clusters.length > 0) {
      return (
        <g key={`map-circle-container-${this.props.queryID}`}>
          {this.props.sounds.map(soundID => (
            <MapCircleContainer
              key={soundID}
              soundID={soundID}
              isThumbnail={this.props.isThumbnail}
            />
          ))}
          {this.props.clusters.map((cluster, idx) => {
            return (
              <ClusterTags
                key={`cluster-tags-${idx}-${this.props.queryID}`}
                clusterPosition={cluster.clusterPosition}
                freqTags={cluster.freqTags}
                queryID={this.props.queryID}
              />);
          })}
        </g>
      );
    }
    return (
      <g key={`map-circle-container-${this.props.queryID}`}>
        {this.props.sounds.map(soundID => (
            <MapCircleContainer
              key={soundID}
              soundID={soundID}
              isThumbnail={this.props.isThumbnail}
            />
          ))};
      </g>
    );
  }
}

// FIXED: space was always undefined because no query ID was present
const makeMapStateToProps = (_, ownProps) => {
  const { queryID, isThumbnail, clusters } = ownProps;
  return (state) => {
    const { shouldShowClusterTags } = state.settings;
    const space = state.spaces.spaces.find(curSpace =>
      curSpace.queryID === queryID); // HINT: this is the way to get the currentSpaceObj!
    return Object.assign({ queryID, isThumbnail, clusters, shouldShowClusterTags }, space);
  };
};

Space.propTypes = propTypes;
Space.defaultProps = defaultProps;
export default connect(makeMapStateToProps, {})(Space);
