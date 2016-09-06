import React from 'react';
import { connect } from 'react-redux';
import { setSpaceAsCenter, removeSpace } from '../../actions/map';
import baseTab from './BaseTab';
import SpaceThumbnail from './SpaceThumbnail';
import '../../stylesheets/SpacesThumbnails.scss';

const propTypes = {
  spaces: React.PropTypes.array,
  currentSpace: React.PropTypes.string,
  setSpaceAsCenter: React.PropTypes.func,
  removeSpace: React.PropTypes.func,
};

function Spaces(props) {
  return (
    <ul className="spaces-thumbnails-container">
      {props.spaces.map(space => (
        <li key={space.queryID}>
          <SpaceThumbnail
            {...space}
            isSelected={space.queryID === props.currentSpace}
            onClick={() => props.setSpaceAsCenter(space)}
            onRemoveClick={() => props.removeSpace(space)}
          />
        </li>))}
    </ul>
  );
}

Spaces.propTypes = propTypes;
const mapStateToProps = (state) => state.spaces;
export default connect(mapStateToProps, {
  setSpaceAsCenter,
  removeSpace,
})(baseTab('Spaces', Spaces));
