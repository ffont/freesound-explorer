import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { lighten } from 'utils/colorsUtils';
import './SoundList.scss';
import { selectSound, deselectSound, toggleHoveringSound } from '../../containers/Sounds/actions';
import { playAudio, stopAudio } from '../../containers/Audio/actions';

const propTypes = {
  sounds: React.PropTypes.object,
  space: React.PropTypes.object,
  selectedSounds: React.PropTypes.array,
  selectSound: React.PropTypes.func,
  deselectSound: React.PropTypes.func,
  playAudio: React.PropTypes.func,
  stopAudio: React.PropTypes.func,
  toggleHoveringSound: React.PropTypes.func,
  shouldPlayOnHover: React.PropTypes.bool,
};

class SoundList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    const data = [];

    // only list sounds of current selected space
    // TODO: UMGESTELLT AUF sounds statt byID
    Object.keys(this.props.sounds)
      .forEach((id) => {
        // copy sound here, so redux state remains uncanged!
        const { license, tags, name, username, duration, isPlaying, isHovered, color } = this.props.sounds[id];
        const sound = { id, license, tags, name, username, duration, isPlaying, isHovered, color }; // Object.assign({}, this.props.sounds.byID[id]);
        // format data fields
        if (sound.duration) {
          sound.durationfixed = sound.duration.toFixed(2);
        }
        if (sound.license) {
          switch (sound.license) {
            case 'http://creativecommons.org/licenses/by/3.0/':
              sound.shortLicense = 'CC BY 3.0';
              break;
            case 'http://creativecommons.org/publicdomain/zero/1.0/':
              sound.shortLicense = 'CC0 1.0';
              break;
            case 'http://creativecommons.org/licenses/by-nc/3.0/':
              sound.shortLicense = 'CC BY-NC 3.0';
              break;
            case 'http://creativecommons.org/licenses/by-nc/4.0/':
              sound.shortLicense = 'CC BY-NC 4.0';
              break;
            case 'http://creativecommons.org/licenses/sampling+/1.0/':
              sound.shortLicense = 'Sampling Plus 1.0';
              break;
            case 'http://creativecommons.org/licenses/by-sa/4.0/':
              sound.shortLicense = 'CC BY-SA 4.0';
              break;
            case 'http://creativecommons.org/licenses/by-nd/4.0/':
              sound.shortLicense = 'CC BY-ND 4.0';
              break;
            default:
              sound.shortLicense = 'not specified!';
          }
        }
        if (sound.tags) {
          // sort array lexically, ignoring case
          sound.tagsStr = sound.tags.sort((a, b) => {
            if (a.toUpperCase() < b.toUpperCase()) {
              return -1;
            }
            return 1;
          }).join(', ');
        }
        sound.isSelected = this.props.selectedSounds.includes(sound.id);
        data.push(sound);
      });

    const columns = [{
      Header: 'Name',
      accessor: 'name', // String-based value accessors!
      minWidth: 225,
      // style: { backgroundColor: 'white' },
    }, {
      Header: 'Duration',
      accessor: 'durationfixed',
      width: 70,
//    style:{color:"red"}
    }, {
      Header: 'Username',
      accessor: 'username',
    },
    {
      Header: 'Tags',
      accessor: 'tagsStr',
      minWidth: 400,
//    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    },
    {
      Header: 'License',
      accessor: 'shortLicense',
      minWidth: 150,
    },
    ];

    return (
      <ReactTable
        key="react-table-soundlist"
        data={data}
        showPageSizeOptions={false}
        showPaginationBottom={false}
        defaultPageSize={data.length}
        style={{
          height: "650px" // This will force the table body to overflow and scroll, since there is not enough room
        }}
        defaultSorted={[
          {
            id: "name",
            desc: false,
          }
        ]}
        columns={columns}
        className="ReactTable -striped -highlight"
        getTheadProps = {() => {
          return {
            style: {
              background: "#373737",
              borderRadius: "7px",
              // textAlignment: "left",
            },
          }
        }}

        getTrProps={(_, rowInfo) => {
          return {
            onClick: (e, handleOriginal) => {
              // this.props.selectSound(rowInfo.original.id);
              // this.props.playAudio(rowInfo.original.id);
              if (rowInfo.original.isPlaying) {
                this.props.stopAudio(rowInfo.original.id);
              } else if (!rowInfo.original.isSelected) {
                this.props.playAudio(rowInfo.original.id);
              }
              if (rowInfo.original.isSelected) {
                // toggle selecion
                this.props.deselectSound(rowInfo.original.id);
              } else {
                // toggle selection
                this.props.selectSound(rowInfo.original.id);
              }
              if (handleOriginal) {
                handleOriginal();
              }
            },
            onMouseEnter: () => {
              if (this.props.shouldPlayOnHover) {
                this.props.playAudio(rowInfo.original.id);
              }
              this.props.toggleHoveringSound(rowInfo.original.id);
            },
            onMouseLeave: () => {
              this.props.toggleHoveringSound(rowInfo.original.id);
            },
            style: {
              background: (rowInfo.original.isHovered || rowInfo.original.isSelected) ?
                lighten('#666666', 1.5) : rowInfo.original.color,
              color: (rowInfo.original.isHovered || rowInfo.original.isSelected) ?
              'black' : 'white',
              opacity: '0.9',
              borderRadius: '7px',
            },
          }
          }
        }
      />
    );
  }
}

SoundList.propTypes = propTypes;
function mapStateToProps(_, ownProps) {
  const { space } = ownProps;
  return (state) => {
    const { shouldPlayOnHover } = state.settings;
    const sounds = {};
    space.sounds.forEach(soundID => sounds[soundID] = state.sounds.byID[soundID]);
    const { selectedSounds } = state.sounds;
    return {
      sounds,
      shouldPlayOnHover,
      selectedSounds,
    };
  }
}

export default connect(mapStateToProps, {
  selectSound,
  deselectSound,
  playAudio,
  stopAudio,
  toggleHoveringSound,
})(SoundList);
