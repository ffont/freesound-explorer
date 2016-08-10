import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/PathDisplay.scss';
import { elementWithId } from '../../utils/arrayUtils';
import { truncatedString } from '../../utils/misc';
import { deleteSoundFromPath } from '../../actions';
import Waveform from '../SoundInfo/Waveform';

const propTypes = {
  path: React.PropTypes.object,
  deleteSoundFromPath: React.PropTypes.func,
  loadSoundByFreesoundId: React.PropTypes.func,
};

class PathDisplay extends React.Component {
  render() {
    if (this.props.path === undefined) {
      return null;
    }
    const soundList = (
      <ul className="path-sounds-list">
        {this.props.path.sounds.map((sound, soundIndex) => (
          <li key={soundIndex}>
            <Waveform
              sound={sound}
              loadSoundByFreesoundId={this.props.loadSoundByFreesoundId}
              useProportionalWidth
            />
          </li>))}
      </ul>
    );
    return soundList;
  }
}

const mapStateToProps = (state) => {
  const { paths, selectedPath } = state.paths;
  return { path: elementWithId(paths, selectedPath) };
};

PathDisplay.propTypes = propTypes;
export default connect(mapStateToProps, {
  deleteSoundFromPath,
}, undefined, { withRef: true })(PathDisplay);
