import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MapPathLine from 'components/Paths/MapPathLine';

const propTypes = {
  soundFrom: PropTypes.object,
  soundTo: PropTypes.object,
  isPathPlaying: PropTypes.bool,
};

const MapPathLineContainer = props => (
  <MapPathLine
    x1={props.soundFrom.position.cx}
    y1={props.soundFrom.position.cy}
    x2={props.soundTo.position.cx}
    y2={props.soundTo.position.cy}
    isPathPlaying={props.isPathPlaying}
  />
);

const makeMapStateToProps = (_, ownProps) => {
  const { soundFromID, soundToID, isPathPlaying } = ownProps;
  return (state) => {
    const soundFrom = state.sounds.byID[soundFromID];
    const soundTo = state.sounds.byID[soundToID];
    return { soundFrom, soundTo, isPathPlaying };
  };
};

MapPathLineContainer.propTypes = propTypes;
export default connect(makeMapStateToProps, {})(MapPathLineContainer);
