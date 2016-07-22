import React from 'react';
import freesound from '../../vendors/freesound';
import '../../stylesheets/SoundInfo.scss';

const propTypes = {
  position: React.PropTypes.object,
  sound: React.PropTypes.object,
  isUserLoggedIn: React.PropTypes.bool,
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
    }
  }

  bookmarkSound() {
    freesound.setToken(sessionStorage.getItem('access_token'), 'oauth');
    const sound = this.props.sound;
    const successCallback = () => console.log('Sound bookmarked!');
    const errorCallback = () => console.log('Error bookmarking sound...');
    sound.bookmark(
      sound.name,  // Use sound name
      'Freesound Explorer',  // Category
      successCallback,
      errorCallback
    );
  }

  render() {
    const containerStyle = this.getContainerStyle();
    this.updateSoundContent();
    if (!this.lastSound) {
      return null;
    }
    return (
      <div className={this.className} style={containerStyle}>
        <div>
          <a href={this.lastSound.url}>
            <div className="sound-info-modal-title">
              {this.lastSound.name}
            </div>
          </a>
          <div className="sound-info-modal-content">
          </div>
        </div>
      </div>
    );
  }
}

SoundInfo.propTypes = propTypes;
export default SoundInfo;
