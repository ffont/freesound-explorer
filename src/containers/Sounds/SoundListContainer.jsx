import React from 'react';
import SoundList from '/components/Sounds/SoundList';
import { connect } from 'react-redux';
// import actions here

const propTypes = {
  spaces : React.PropTypes.array,
  currentSpace: React.PropTypes.string,
  sounds: React.PropTypes.array
};

const SoundListContainer = props => (
  <ul>{props.spaces.map(space => (
    <SoundList
      space={space}
      sounds={props.sounds}
      />
    ))}
  </ul>
);


//class SoundListContainer extends React.Component {
//  constructor(props) {
//    super(props);
//  }
//  
//  render(){
//    return (
//      <div>
//        <SoundList />
//      </div>
//    );
//  };
//};


SoundListContainer.propTypes = propTypes;
const mapStateToProps = state => state.spaces;

export default connect(mapStateToProps)(SoundListContainer);
