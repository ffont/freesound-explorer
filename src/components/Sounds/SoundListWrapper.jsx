import React from 'react';
import PropTypes from 'prop-types'; 
import { connect } from 'react-redux';
import SoundList from '../../containers/Sounds/SoundList';

const propTypes = {
  space: PropTypes.object,
};

/* 
* The Sound List is a comlementary feature to the MapCircle view.
* Here sorting shall be possible to navigate on more abstract criteria, eg. duration.
* Highlight on hovering and selection shall be synchronous ot the map.
*/

const SoundListWrapper = props =>
  (
    <div>
      {typeof props.space === 'undefined' ?
        <div className="empty-soundlist">No sounds to list, please search first!</div> :
        <div className="sound-list-container">
          <h2>{`${props.space.query}: ${props.space.sounds.length} Sounds`}</h2>
          <SoundList
            key={props.space.queryID}
            space={props.space}
          />
        </div>}
    </div>
  );

SoundListWrapper.propTypes = propTypes;

function mapStateToProps(state) {
  const space = state.spaces.spaces.find(sp => sp.queryID === state.spaces.currentSpace);
  return {
    space,
  };
}

export default connect(mapStateToProps)(SoundListWrapper);
