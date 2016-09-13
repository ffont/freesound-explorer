import React from 'react';
import { connect } from 'react-redux';
import { setSpaceAsCenter, removeSpace } from './actions';
import SpaceThumbnail from '../../components/Spaces/SpaceThumbnail';

const propTypes = {
  spaces: React.PropTypes.array,
  currentSpace: React.PropTypes.string,
  setSpaceAsCenter: React.PropTypes.func,
  removeSpace: React.PropTypes.func,
};

const Spaces = props => (
  <ul>
  {props.spaces.map(space => (
    <SpaceThumbnail
      key={space.queryID}
      queryID={space.queryID}
      query={space.query}
      queryParams={space.queryParams}
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
