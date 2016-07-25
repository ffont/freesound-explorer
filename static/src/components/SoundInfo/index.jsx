import React from 'react';
import freesound from '../../vendors/freesound';
import '../../stylesheets/SoundInfo.scss';
import Waveform from './Waveform';
import sassVariables from 'json!../../stylesheets/variables.json';

const propTypes = {
  position: React.PropTypes.object,
  sound: React.PropTypes.object,
  isUserLoggedIn: React.PropTypes.bool,
  updateSystemStatusMessage: React.PropTypes.func,
};

const DEFAULT_CLASSNAME = 'sound-info-modal';

class SoundInfo extends React.Component {
  constructor(props) {
    super(props);
    this.className = DEFAULT_CLASSNAME;
    this.lastTopPosition = 0;
    this.lastLeftPosition = 0;
    this.lastSound = undefined;
  }

  componentWillReceiveProps(nextProps) {
    if (!!this.props.position && !nextProps.position) {
      // hide modal: reset classname to default (not visible)
      this.className = DEFAULT_CLASSNAME;
    } else if (!this.props.position && !!nextProps.position) {
      // show modal: change classname to contain 'active'
      this.className += ' active';
      if (nextProps.position.y < parseInt(sassVariables.soundInfoModalHeight, 10)) {
        this.className += '-down';
      }
    }
  }

  getContainerStyle() {
    if (!!this.props.position) {
      this.lastTopPosition = this.props.position.y;
      this.lastLeftPosition = this.props.position.x;
    }
    return { top: this.lastTopPosition, left: this.lastLeftPosition };
  }

  updateSoundContent() {
    if (!!this.props.sound) {
      this.lastSound = this.props.sound;
      this.bookmarkSound = this.bookmarkSound.bind(this);
      this.downloadSound = this.downloadSound.bind(this);
    }
  }

  bookmarkSound() {
    freesound.setToken(sessionStorage.getItem('access_token'), 'oauth');
    const sound = this.lastSound;
    sound.bookmark(
      sound.name,  // Use sound name
      'Freesound Explorer' // Category
    ).then(() => {
      this.lastSound.isBookmarked = true;
      this.props.updateSystemStatusMessage('Sound bookmarked!', 'success');
    },
    () => this.props.updateSystemStatusMessage('Error bookmarking sound', 'error'));
  }

  downloadSound() {
    this.props.updateSystemStatusMessage('Downloading sounds is not implemented yet', 'info');
  }

  render() {
    const containerStyle = this.getContainerStyle();
    this.updateSoundContent();
    if (!this.lastSound) {
      return null;
    }
    let userButtons = null;
    if (this.props.isUserLoggedIn) {
      const bookmarkSoundIcon = (this.lastSound.isBookmarked) ? (
        <button>
          <i className="fa fa-star fa-lg" aria-hidden />
        </button>
      ) : (
        <button onClick={this.bookmarkSound}>
          <i className="fa fa-star-o fa-lg" aria-hidden />
        </button>
      );
      userButtons = (
        <div className="sound-info-buttons-container">
          {bookmarkSoundIcon}
          <button onClick={this.downloadSound}>
            <i className="fa fa-download fa-lg" aria-hidden="true" />
          </button>
        </div>
      );
    }
    return (
      <div className={this.className} style={containerStyle}>
        <div>
          <a href={this.lastSound.url}>
            <div className="sound-info-modal-title">
              <div>{this.lastSound.name}</div>
              <div>by {this.lastSound.username}</div>
            </div>
          </a>
          <div className="sound-info-modal-content">
            <Waveform sound={this.props.sound} />
            {userButtons}
          </div>
        </div>
      </div>
    );
  }
}

SoundInfo.propTypes = propTypes;
export default SoundInfo;
