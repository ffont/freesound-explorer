import React from 'react';
import PropTypes from 'prop-types';
import SpaceThumbnail from 'components/Spaces/SpaceThumbnail';
import { connect } from 'react-redux';
import { setSpaceAsCenter, removeSpace } from './actions';

const propTypes = {
  spaces: PropTypes.array,
  currentSpace: PropTypes.string,
  setSpaceAsCenter: PropTypes.func,
  removeSpace: PropTypes.func,
};

const Spaces = props => (
  <ul>{props.spaces.length > 0 ? '' : <li>Before using spaces, you should search some sounds...</li>}
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
