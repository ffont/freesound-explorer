import React from 'react';

const propTypes = {
  currentPositionInMap: React.PropTypes.shape({
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
  isThumbnail: React.PropTypes.bool,
};

const getStyle = (props) => ({
  top: props.currentPositionInMap.y,
  left: props.currentPositionInMap.x,
});

class SpaceTitle extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.currentPositionInMap !== this.props.currentPositionInMap) ||
      (nextProps.sounds !== this.props.sounds)
    );
  }

  render() {
    if (!this.props.sounds.length) {
      return null;
    }
    return (
      <div
        className={`space-title${this.props.isThumbnail ? ' thumbnail' : ''}`}
        style={(this.props.isThumbnail) ? {} : getStyle(this.props)}
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
