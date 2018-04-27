import React from 'react';
import PropTypes from 'prop-types';
import './SpaceTitle.scss';

const propTypes = {
  currentPositionInMap: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  query: PropTypes.string,
  queryParams: PropTypes.shape({
    maxResults: PropTypes.number,
    maxDuration: PropTypes.number,
    minDuration: PropTypes.number,
    descriptor: PropTypes.string,
  }),
  sounds: PropTypes.array,
  isThumbnail: PropTypes.bool,
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
        className={`SpaceTitle${this.props.isThumbnail ? ' thumbnail' : ''}`}
        style={(this.props.isThumbnail) ? {} : getStyle(this.props)}
      >
        <header><h1>{this.props.query}</h1></header>
        <ol>
          <li>{this.props.sounds.length} sounds</li>
          <li>Arranged by {
            (this.props.queryParams.descriptor) === 'lowlevel.mfcc.mean' ? 'Timbre' : 'Tonality'}
          </li>
          <li>Duration: {this.props.queryParams.minDuration} to {this.props.queryParams.maxDuration} s</li>
        </ol>
      </div>);
  }
}

SpaceTitle.propTypes = propTypes;
export default SpaceTitle;
