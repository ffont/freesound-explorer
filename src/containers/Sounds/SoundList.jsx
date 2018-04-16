import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { lighten } from 'utils/colorsUtils';
import './SoundList.scss';
import { selectSound, deselectSound, toggleHoveringSound } from '../../containers/Sounds/actions';
import { reshapeSoundListData } from '../../containers/Sounds/utils';
import { playAudio, stopAudio } from '../../containers/Audio/actions';

const propTypes = {
  sounds: React.PropTypes.array,
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

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.selectedSounds !== this.props.selectedSounds
      || nextProps.space !== this.props.space
    );
  }

  render() {
    const data = this.props.sounds;

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
          height: '650px', // This will force the table body to overflow and scroll, since there is not enough room
        }}
        defaultSorted={[
          {
            id: 'name',
            desc: false,
          },
        ]}
        columns={columns}
        className="ReactTable -striped -highlight"
        getTheadProps={() => {
          return {
            style: {
              background: '#373737',
              borderRadius: '7px',
              // textAlignment: "left",
            },
          };
        }}
        // getTrProps={() => {
        //   return {
        //     style: {
        //       height: '20px',
        //     },
        //   };
        // }}

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
    const { selectedSounds } = state.sounds;
    const collectedsounds = {};
    space.sounds.forEach(soundID => collectedsounds[soundID] = state.sounds.byID[soundID]);
    const sounds = reshapeSoundListData(collectedsounds, selectedSounds);
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
