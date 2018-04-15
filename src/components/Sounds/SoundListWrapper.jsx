import React from 'react';
import { connect } from 'react-redux';
import { getCurrentSpaceObj } from '../../containers/Spaces/utils';
import SoundList from '../../containers/Sounds/SoundList';
import { selectSound, deselectSound, toggleHoveringSound } from '../../containers/Sounds/actions';
import { playAudio, stopAudio } from '../../containers/Audio/actions';

const propTypes = {
  space: React.PropTypes.object,
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
          <SoundList
            key={props.space.queryID}
            space={props.space}
          />
        </div>}
    </div>
  );

SoundListWrapper.propTypes = propTypes;

function mapStateToProps(state) {
  const space = getCurrentSpaceObj(state.spaces.spaces, state.spaces.currentSpace);
  return {
    space
  };
}

export default connect(mapStateToProps)(SoundListWrapper);
