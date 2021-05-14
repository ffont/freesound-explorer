import PropTypes from 'prop-types';
import './MapPathLine.scss';

const propTypes = {
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  isPathPlaying: PropTypes.bool,
};

const MapPathLine = props => (
  <line
    x1={props.x1}
    y1={props.y1}
    x2={props.x2}
    y2={props.y2}
    className={(props.isPathPlaying) ? 'MapPathLine playing' : 'MapPathLine'}
  />
);

MapPathLine.propTypes = propTypes;
export default MapPathLine;
