import React from 'react';
import SpaceTitle from '../Map/SpaceTitle';
import Space from '../Map/Space';

const propTypes = {
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
      <SpaceTitle {...props} isThumbnail />
      <svg><Space {...props} isThumbnail /></svg>
      <i className="fa fa-lg fa-times-circle-o" onClick={props.onRemoveClick} aria-hidden />
    </div>
  );
}

SpaceThumbnail.propTypes = propTypes;
export default SpaceThumbnail;
