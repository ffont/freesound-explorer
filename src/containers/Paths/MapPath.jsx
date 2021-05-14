import PropTypes from 'prop-types';
import { range } from 'utils/arrayUtils';
import MapPathLineContainer from './MapPathLineContainer';

const propTypes = {
  path: PropTypes.object,
};

const MapPath = props => (
  <g>
    {range(props.path.sounds.length - 1).map((index) => {
      const soundFromID = props.path.sounds[index];
      const soundToID = props.path.sounds[index + 1];
      return (
        <MapPathLineContainer
          key={`${index}_${props.path.isPlaying}`}
          soundFromID={soundFromID}
          soundToID={soundToID}
          isPathPlaying={props.path.isPlaying}
        />
      );
    })}
  </g>
);

MapPath.propTypes = propTypes;
export default MapPath;
