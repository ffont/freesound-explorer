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
    sorting: PropTypes.string,
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

    function makeSortingLabel(sortstr) {
      let label;
      switch (sortstr) {
        case 'score': {
          label = 'Relevance';
          break;
        }
        case 'rating_desc': {
          label = 'Rating';
          break;
        }
        case 'duration_desc': {
          label = 'Duration';
          break;
        }
        case 'downloads_desc': {
          label = 'Downloads';
          break;
        }
        case 'creation_desc': {
          label = 'newest first';
          break;
        }
        case 'creation_asc': {
          label = 'oldest first';
          break;
        }
        default: {
          label = 'Releveance';
          break;
        }
      }
      return label;
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
          <li>
            Sorted by {
              (makeSortingLabel(this.props.queryParams.sorting))
            }</li>
        </ol>
      </div>);
  }
}

SpaceTitle.propTypes = propTypes;
export default SpaceTitle;
