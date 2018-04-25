import React from 'react';
import SpaceThumbnail from 'components/Spaces/SpaceThumbnail';
import { connect } from 'react-redux';
import { setSpaceAsCenter, removeSpace } from './actions';

const propTypes = {
  spaces: React.PropTypes.array,
  currentSpace: React.PropTypes.string,
  setSpaceAsCenter: React.PropTypes.func,
  removeSpace: React.PropTypes.func,
};

const Spaces = props => (
  <ul>{props.spaces.length > 0 ? '' : <li className="empty-space-placeholder">Before using spaces, you should search some sounds...</li>}
   {props.spaces.map(space => (
    <SpaceThumbnail
      key={space.queryID}
      queryID={space.queryID}
      query={space.query}
      queryParams={space.queryParams}
      sounds={space.sounds}
      currentPositionInMap={space.currentPositionInMap}
      isSelected={space.queryID === props.currentSpace}
      onClick={() => props.setSpaceAsCenter(space)}
      onRemoveClick={() => props.removeSpace(space)}
    />))}
  </ul>
);

Spaces.propTypes = propTypes;
const mapStateToProps = state => state.spaces;
export default connect(mapStateToProps, {
  setSpaceAsCenter,
  removeSpace,
})(Spaces);
