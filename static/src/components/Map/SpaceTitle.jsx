import React from 'react';

const propTypes = {
  positionInMap: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }),
  query: React.PropTypes.string,
  queryParams: React.PropTypes.shape({
    maxResults: React.PropTypes.number,
    maxDuration: React.PropTypes.number,
    minDuration: React.PropTypes.number,
    descriptor: React.PropTypes.string,
  }),
  sounds: React.PropTypes.array,
};

class SpaceTitle extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.positionInMap !== this.props.positionInMap) ||
      (nextProps.sounds !== this.props.sounds)
    );
  }

  render() {
    return (
      <div
        className="space-title"
        style={{ top: this.props.positionInMap.y, left: this.props.positionInMap.x }}
      >
        <header><h1>{this.props.query}</h1></header>
        <ol>
          <li>{this.props.sounds.length} sounds</li>
          <li>Arranged by {
            (this.props.queryParams.descriptor) === 'lowlevel.mfcc.mean' ? 'Timbre' : 'Tonality'}
          </li>
          <li>Duration: [{this.props.queryParams.minDuration},
            {this.props.queryParams.maxDuration}]s</li>
        </ol>
      </div>);
  }
}

SpaceTitle.propTypes = propTypes;
export default SpaceTitle;
