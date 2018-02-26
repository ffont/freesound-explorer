import React from 'react';
import { lighten } from 'utils/colorsUtils';
import './SoundList.scss';

const propTypes = {
  sounds : React.PropTypes.array,
  space: React.PropTypes.array
};

// TODO: get sound Objects by ID and display columns

class SoundList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render(){
    return(
      <ul>{this.props.space.sounds.map(soundID => (
        <li>
            {soundID}
        </li>
        ))}
      </ul>
    );
  }
}

SoundList.propTypes = propTypes;
export default SoundList;