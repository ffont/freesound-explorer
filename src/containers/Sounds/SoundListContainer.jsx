import React from 'react';
import SoundListItem from '/components/Sounds/SoundListItem';
import { getCurrentSpace } from '../Spaces/utils'
import { connect } from 'react-redux';
// import actions here

const propTypes = {
  space : React.PropTypes.object,
//  currentSpace: React.PropTypes.string,
  sounds: React.PropTypes.object,
};

// Q?? class or not?! tab as container?
//const space = props => getCurrentSpace(props.spaces.spaces, props.currentSpace);


const SoundListContainer = props =>
  (
    <div className="SoundList-container">
        <SoundListItem
          key = {props.space.queryID}
          space={props.space}
          sounds={props.sounds.byID}
          />
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
