import React from 'react';
import { connect } from 'react-redux';
import { setSpaceAsCenter } from '../../actions/map';
import baseTab from './BaseTab';
import SpaceThumbnail from './SpaceThumbnail';
import '../../stylesheets/SpacesThumbnails.scss';

const propTypes = {
  spaces: React.PropTypes.array,
  currentSpace: React.PropTypes.string,
};

function Spaces(props) {
  return (
    <ul className="spaces-thumbnails-container">
      {props.spaces.map(space => (
        <li key={space.queryID}>
          <SpaceThumbnail
            {...space}
            isSelected={space.queryID === props.currentSpace}
            onClick={setSpaceAsCenter}
          />
        </li>))}
    </ul>
  );
}

Spaces.propTypes = propTypes;
const mapStateToProps = (state) => state.spaces;
export default connect(mapStateToProps, { setSpaceAsCenter })(baseTab('Spaces', Spaces));
