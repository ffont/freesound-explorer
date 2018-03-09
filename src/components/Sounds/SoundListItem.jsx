import React from 'react';
import { lighten } from 'utils/colorsUtils';
import './SoundListItem.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


const propTypes = {
  sounds: React.PropTypes.object,
  space: React.PropTypes.object,
};

// TODO: get sound Objects by ID and display columns
// TODO: build table

class SoundListItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const data = [];

    // only list sounds of current selected space
    Object.values(this.props.space.sounds)
      .forEach((id) => {
        const sound = this.props.sounds[id];
        // console.log(sound.duration.toFixed(2));

      // TODO: fix variing precisions

      // format data fields
      // debugger;
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

      if (sound.tags){
        sound.tagsStr = sound.tags.sort().join(', ');
      }

        data.push(sound);
      });

    const columns = [{
      Header: 'Name',
      accessor: 'name',
      minWidth: 150, // String-based value accessors!
    }, {
      Header: 'Username',
      accessor: 'username',
    }, { Header: 'Duration',
      accessor: 'durationfixed',
//     style:{color:"red"}

    }, {
      Header: 'License',
      accessor: 'shortLicense',
    },
//   TODO: deconcat tags
    {
      Header: 'Tags',
      accessor: 'tagsStr',
//    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    },

    ];

//    {
//    id: 'friendName', // Required because our accessor is not a string
//    Header: 'Friend Name',
//    accessor: d => d.friend.name // Custom value accessors!
//  }, {
//    Header: props => <span>Friend Age</span>, // Custom header components!
//    accessor: 'friend.age'
//  }]
    return (
      <ReactTable
        data={data}
        showPageSizeOptions={false}
        showPaginationBottom={false}
        defaultPageSize={data.length}
        columns={columns}
        className="-striped -highlight"
        // TODO: click handling etc.


      />
    );
  }
}

// TODO: handle clicks on table >> must be dorpped as prop into react Table:
//        getTdProps={(state, rowInfo, column, instance) => {
//          return {
//            onClick: (e, handleOriginal) => {
//              console.log('A Td Element was clicked!')
//              console.log('it produced this event:', e)
//              console.log('It was in this column:', column)
//              console.log('It was in this row:', rowInfo)
//              console.log('It was in this table instance:', instance)
//              console.log('original?', handleOriginal)
//
//              // IMPORTANT! React-Table uses onClick internally to trigger
//              // events like expanding SubComponents and pivots.
//              // By default a custom 'onClick' handler will override this functionality.
//              // If you want to fire the original onClick handler, call the
//              // 'handleOriginal' function.
//              if (handleOriginal) {
//                handleOriginal()
//                }
//              }
//            }
//          }
//        }


SoundListItem.propTypes = propTypes;
export default SoundListItem;
