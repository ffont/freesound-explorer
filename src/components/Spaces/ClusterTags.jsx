import { Component } from 'react';
import PropTypes from 'prop-types';
import './ClusterTags.scss';

const propTypes = {
  clusterPosition: PropTypes.shape({
    cx: PropTypes.number,
    cy: PropTypes.number,
  }),
  freqTags: PropTypes.array,
  queryID: PropTypes.string,
};

class ClusterTags extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.clusterPosition !== nextProps.clusterPosition);
  }

  render() {
    if (!this.props.freqTags || !this.props.freqTags.length > 0) {
      return null;
    }
    return (
      <g>
        {this.props.freqTags.slice(0, 5).map((tag, idx) => (
          <text
            key={`cluster-tag-${this.props.queryID}-${idx}`}
            className="clustertag"
            x={this.props.clusterPosition.cx}
            y={this.props.clusterPosition.cy + (idx * 15)}
          >{tag}</text>))}
      </g>
    );
  }
}

ClusterTags.propTypes = propTypes;
export default ClusterTags;
