import React from 'react';
import { lighten } from 'utils/colorsUtils';
import './SoundListItem.scss';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


const propTypes = {
  sounds : React.PropTypes.object,
  space: React.PropTypes.object,
};

// TODO: get sound Objects by ID and display columns
// TODO: build table

class SoundListItem extends React.Component {
  constructor(props) {
    super(props);  
  }
  render(){
    const data = [];
    
    // only list sounds of current selected space
    Object.values(this.props.space.sounds)
      .forEach((id) => {
      const sound = this.props.sounds[id];
      //TODO: fix variing precisions
      
      // format data fields
      
      if (sound.duration){
        sound.duration = sound.duration.toPrecision(3);
      };
      if (sound.license) {
        switch (sound.license) {
          case "http://creativecommons.org/licenses/by/3.0/": sound.license =  "CC BY 3.0";
            break;
          case "http://creativecommons.org/publicdomain/zero/1.0/":
            sound.license =  "CC0 1.0";
            break;
          case "http://creativecommons.org/licenses/by-nc/3.0/":
            sound.license =  "CC BY-NC 3.0";
            break;
          default:
            sound.license = "not specified!"
        }
      }
      
      if (sound.tags){
        sound.tags = sound.tags.sort().join(", ");
      }
      
      data.push(sound);
    });
    
    const columns = [{
    Header: 'Name',
    accessor: 'name',
    minWidth: 150 // String-based value accessors!
  },{
    Header: 'Username',
    accessor: 'username',
  }, {Header: 'Duration',
     accessor: 'duration',
//     style:{color:"red"}
    
  }, {
    Header: 'License',
    accessor: 'license',
  },
//   TODO: deconcat tags
   {
    Header: 'Tags',
    accessor: 'tags',
//    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }
                     
 ]
    
//    {
//    id: 'friendName', // Required because our accessor is not a string
//    Header: 'Friend Name',
//    accessor: d => d.friend.name // Custom value accessors!
//  }, {
//    Header: props => <span>Friend Age</span>, // Custom header components!
//    accessor: 'friend.age'
//  }]
    return(    
      <ReactTable
        data={data}
        showPageSizeOptions= {false}
        showPaginationBottom= {false}
        defaultPageSize= {data.length}
        columns={columns}
        className="-striped -highlight"
        // TODO: click handling etc.


      />
    );
  }
}

//TODO: handle clicks on table >> must be dorpped as prop into react Table:
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