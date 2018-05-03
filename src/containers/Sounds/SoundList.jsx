import React from 'react';
import PropTypes from 'prop-types';
import { lighten } from 'utils/colorsUtils';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import '../../stylesheets/react-table.css';
import { selectSound, deselectSound, deselectAllSounds,
   toggleHoveringSound } from '../../containers/Sounds/actions';
import { reshapeSoundListData } from '../../containers/Sounds/utils';
import { playAudio, stopAudio } from '../../containers/Audio/actions';

const propTypes = {
  sounds: PropTypes.array,
  space: PropTypes.object,
  selectedSounds: PropTypes.array,
  hoveredSounds: PropTypes.array,
  selectSound: PropTypes.func,
  deselectSound: PropTypes.func,
  deselectAllSounds: PropTypes.func,
  playAudio: PropTypes.func,
  stopAudio: PropTypes.func,
  toggleHoveringSound: PropTypes.func,
  shouldPlayOnHover: PropTypes.bool,
  shouldMultiSelect: PropTypes.bool,
};

class SoundList extends React.Component {

  shouldComponentUpdate(nextProps) {
    return (
      !_.isEqual(nextProps.selectedSounds, this.props.selectedSounds)
      // || nextProps.space !== this.props.space
      || !_.isEqual(nextProps.hoveredSounds, this.props.hoveredSounds)
    );
  }

  render() {
    const data = this.props.sounds;

    const columns = [{
      Header: 'Name',
      accessor: 'name', // String-based value accessors!
      minWidth: 275,
      // style: { backgroundColor: 'white' },
    }, {
      Header: 'Duration',
      accessor: 'durationfixed',
      width: 70,
    },
    {
      Header: 'License',
      accessor: 'shortLicense',
      minWidth: 150,
    },
    {
      Header: 'Tags',
      accessor: 'tagsStr',
      minWidth: 400,
    },
    {
      Header: 'Username',
      accessor: 'username',
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
          height: '655px', // This will force the table body to overflow and scroll, since there is not enough room
        }}
        defaultSorted={[
          {
            id: 'name',
            desc: false,
          },
        ]}
        columns={columns}
        getTheadProps={() => {
          return {
            style: {
              background: '#373737',
              borderRadius: '7px',
              // textAlignment: "left",
            },
          };
        }}
  
        getTbodyProps={() => {
          return {
            style: {
              overflowY: 'inherit',
            },
          };
        }}

        getTrProps={(_, rowInfo) => {
          return {
            onClick: (e, handleOriginal) => {
               if (rowInfo.original.isPlaying) {
                this.props.stopAudio(rowInfo.original.id);
              } else if (!rowInfo.original.isSelected) {
                this.props.playAudio(rowInfo.original.id);
              }
              if (rowInfo.original.isSelected) {
                // toggle selecion
                this.props.deselectSound(rowInfo.original.id);
              } else if (this.props.shouldMultiSelect) {
                this.props.selectSound(rowInfo.original.id);
              } else {
                // toggle selection
                this.props.deselectAllSounds();
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
          };
        }}
      />
    );
  }
}

SoundList.propTypes = propTypes;
function mapStateToProps(_, ownProps) {
  const { space } = ownProps;
  return (state) => {
    const { shouldPlayOnHover, shouldMultiSelect } = state.settings;
    const { selectedSounds } = state.sounds;

    const collectedsounds = {};
    space.sounds.forEach(soundID => collectedsounds[soundID] = state.sounds.byID[soundID]);
    const sounds = reshapeSoundListData(collectedsounds, selectedSounds);
    const hoveredSounds = [];
    sounds.forEach(sound => { if (sound.isHovered) { hoveredSounds.push(sound.id); } });

    return {
      sounds,
      shouldPlayOnHover,
      shouldMultiSelect,
      selectedSounds,
      hoveredSounds,
    };
  };
}

export default connect(mapStateToProps, {
  selectSound,
  deselectSound,
  deselectAllSounds,
  playAudio,
  stopAudio,
  toggleHoveringSound,
})(SoundList);
