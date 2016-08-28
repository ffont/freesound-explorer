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
  isThumbnail: React.PropTypes.bool,
};

const getStyle = (props) => {
  if (props.isThumbnail) {
    return { top: 20, left: 20, width: '100%' };
  }
  return { top: props.positionInMap.y, left: props.positionInMap.x };
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
        className={`space-title${this.props.isThumbnail ? ' thumbnail' : ''}`}
        style={getStyle(this.props)}
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
