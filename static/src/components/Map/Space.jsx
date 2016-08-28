import React from 'react';
import MapCircle from './MapCircle';

const propTypes = {
  sounds: React.PropTypes.array,
  isThumbnail: React.PropTypes.bool,
};

const defaultProps = {
  isThumbnail: false,
};

class Space extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.sounds !== this.props.sounds;
  }

  render() {
    return (<g>
      {this.props.sounds.map(soundID => (
        <MapCircle
          key={soundID}
          soundID={soundID}
          isThumbnail={this.props.isThumbnail}
        />
      ))}
    </g>);
  }
}

Space.propTypes = propTypes;
Space.defaultProps = defaultProps;
export default Space;

/**
 {this.props.sounds.map((sound, index) => {
   const tsnePosition = {
     x: tsneSolution[index][0],
     y: tsneSolution[index][1],
   };
   const circleRef = `map-point-${sound.id}`;
   const { cx, cy } = this.projectPoint(tsnePosition);
   const isSoundSelected = this.props.selectedSound === sound.id;
   if (isSoundSelected) {
     soundInfoPosition = { x: cx, y: cy };
     soundInfoContent = sound;
   }
   return (
     <MapCircle
       ref={circleRef}
       key={index}
       sound={sound}
       position={{ cx, cy }}
       isSelected={isSoundSelected}
       updateSelectedSound={this.props.updateSelectedSound}
       audioContext={this.props.audioContext}
       audioLoader={this.props.audioLoader}
       playOnHover={this.props.playOnHover}
       projectPoint={this.projectPoint}
       setIsMidiLearningSoundId={this.props.setIsMidiLearningSoundId}
     />
   );
 })}
 {this.props.paths.map((path) => (
   [...Array((path.sounds.length) ? path.sounds.length - 1: 0).keys()].map((sound, index) => {
     const soundFrom = path.sounds[index];
     const soundTo = path.sounds[index + 1];
     const indexSoundFrom = this.props.sounds.indexOf(soundFrom);
     const positionFrom = {
       x: tsneSolution[indexSoundFrom][0],
       y: tsneSolution[indexSoundFrom][1],
     };
     const indexSoundTo = this.props.sounds.indexOf(soundTo);
     const positionTo = {
       x: tsneSolution[indexSoundTo][0],
       y: tsneSolution[indexSoundTo][1],
     };
     const { cx: x1, cy: y1 } = this.projectPoint(positionFrom);
     const { cx: x2, cy: y2 } = this.projectPoint(positionTo);
     return (
       <line
         key={index}
         x1={x1}
         y1={y1}
         x2={x2}
         y2={y2}
         stroke="white"
         strokeWidth={DEFAULT_PATH_STROKE_WIDTH}
         strokeOpacity={(path.isPlaying) ?
           DEFAULT_PATH_STROKE_OPACITY * 10 :
           DEFAULT_PATH_STROKE_OPACITY}
       />
     );
   })
 ))}
 */
