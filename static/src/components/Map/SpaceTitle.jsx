import React from 'react';
import { computeSoundGlobalPosition } from '../../reducers/sounds';

const propTypes = {
  mapPosition: React.PropTypes.shape({
    translateX: React.PropTypes.number,
    translateY: React.PropTypes.number,
    scale: React.PropTypes.number,
  }),
  position: React.PropTypes.shape({
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

const computeStyle = (props) => {
  const tsnePosition = { x: 0, y: 0 };
  const spacePosition = props.position;
  const { mapPosition } = props;
  const { cx, cy } = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
  return {
    top: cy,
    left: cx,
  };
};

class SpaceTitle extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.mapPosition !== this.props.mapPosition) ||
      (nextProps.sounds !== this.props.sounds)
    );
  }

  render() {
    return (
      <div className="space-title" style={computeStyle(this.props)}>
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
