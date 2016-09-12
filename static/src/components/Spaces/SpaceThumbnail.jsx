import React from 'react';
import SpaceTitle from './SpaceTitle';
import Space from '../../containers/Spaces/SpaceContainer';

const propTypes = {
  queryID: React.PropTypes.string,
  query: React.PropTypes.string,
  queryParams: React.PropTypes.object,
  isSelected: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onRemoveClick: React.PropTypes.func,
};

function SpaceThumbnail(props) {
  return (
    <div
      className={`space-thumbnail${(props.isSelected) ? ' active' : ''}`}
      onClick={props.onClick}
    >
      <SpaceTitle
        query={props.query}
        queryParams={props.queryParams}
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
    </div>
  );
}

SpaceThumbnail.propTypes = propTypes;
export default SpaceThumbnail;
