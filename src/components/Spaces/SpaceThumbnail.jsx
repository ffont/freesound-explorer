import React from 'react';
import PropTypes from 'prop-types';
import Space from 'containers/Spaces/SpaceContainer';
import SpaceTitle from './SpaceTitle';

const propTypes = {
  queryID: PropTypes.string,
  query: PropTypes.string,
  queryParams: PropTypes.object,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  sounds: PropTypes.array,
  currentPositionInMap: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onRemoveClick: PropTypes.func,
};

function SpaceThumbnail(props) {
  return (
    <li
      className={`space-thumbnail${(props.isSelected) ? ' active' : ''}`}
      onClick={props.onClick}
    >
      <SpaceTitle
        query={props.query}
        queryParams={props.queryParams}
        sounds={props.sounds}
        currentPositionInMap={props.currentPositionInMap}
        isThumbnail
      />
      <svg><Space queryID={props.queryID} isThumbnail /></svg>
      <i
        className="fa fa-lg fa-times-circle-o"
        aria-hidden
        onClick={(evt) => {
          evt.stopPropagation();
          props.onRemoveClick();
        }}
      />
    </li>
  );
}

SpaceThumbnail.propTypes = propTypes;
export default SpaceThumbnail;
