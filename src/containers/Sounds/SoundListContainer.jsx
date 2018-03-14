import React from 'react';
import { connect } from 'react-redux';
import { getCurrentSpace } from '../Spaces/utils';
import SoundListItem from '../../components/Sounds/SoundListItem';
// import actions here

const propTypes = {
  space: React.PropTypes.object,
//  currentSpace: React.PropTypes.string,
  sounds: React.PropTypes.object,
};

// Q?? class or not?! tab as container?
// const space = props => getCurrentSpace(props.spaces.spaces, props.currentSpace);

// TODO: update error message
const SoundListContainer = props =>
  (
    <div>
      {typeof props.sounds.byID.length !== 'undefined' ? null :
      <div className="empty-soundlist">No sounds to list, please search first!</div> }
      {typeof props.space === 'undefined' ? null :
      <div className="soundList-container">
        <SoundListItem
          key={props.space.queryID}
          space={props.space}
          sounds={props.sounds.byID}
        />
      </div>}
    </div>
  );

SoundListContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    space: getCurrentSpace(state.spaces.spaces, state.spaces.currentSpace),
//    currentSpace: state.spaces.currentSpace,
    sounds: state.sounds,
  };
}


export default connect(mapStateToProps)(SoundListContainer);
