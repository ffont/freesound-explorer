import React from 'react';
import './ClusterTags.scss';

const propTypes = {
  clusterPosition: React.PropTypes.shape({
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
  }),
  freqTags: React.PropTypes.array,
  queryID: React.PropTypes.string,
};

class ClusterTags extends React.Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.clusterPosition !== nextProps.clusterPosition);
  }

  render() {
    if (!this.props.freqTags || !this.props.freqTags.length > 0) {
      return null;
    }
    return (
      <g>
        {this.props.freqTags.map((tag, idx) => (
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
