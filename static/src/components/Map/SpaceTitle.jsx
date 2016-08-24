import React from 'react';
import { computeSoundGlobalPosition } from '../../reducers/sounds';
import sassVariables from 'json!../../stylesheets/variables.json';

const propTypes = {
  mapPosition: React.PropTypes.shape({
    translateX: React.PropTypes.number,
    translateY: React.PropTypes.number,
    scale: React.PropTypes.number,
  }),
  position: React.PropTypes.shape({
    x: React.PropTypes.number,
    y: React.PropTypes.number,
  }),
  query: React.PropTypes.string,
  queryParams: React.PropTypes.shape({
    maxResults: React.PropTypes.number,
    maxDuration: React.PropTypes.number,
    minDuration: React.PropTypes.number,
    descriptor: React.PropTypes.string,
  }),
  sounds: React.PropTypes.array,
};

const computeStyle = (props) => {
  const tsnePosition = { x: 0, y: 0 };
  const spacePosition = props.position;
  const { mapPosition } = props;
  const { cx, cy } = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
  /** as we don't want the div with abs position ('space-title') to occupy space
  at the top-left corner, we assign it a negative position (out of screen). Here
  we take that negative position into account. */
  const { titleNegativePadding } = sassVariables;
  const negativePadding = parseInt(titleNegativePadding, 10);
  return {
    position: 'relative',
    top: cy - negativePadding,
    left: cx - negativePadding,
    zIndex: -1,
  };
};

function SpaceTitle(props) {
  return (<div className="space-title">
    <div style={computeStyle(props)}>
      <header><h1>{props.query}</h1></header>
      <ol>
        <li>{props.sounds.length} sounds</li>
        <li>Arranged by {
            (props.queryParams.descriptor) === 'lowlevel.mfcc.mean' ? 'Timbre' : 'Tonality'}
        </li>
        <li>Duration: [{props.queryParams.minDuration}, {props.queryParams.maxDuration}]s</li>
      </ol>
    </div>
  </div>);
}

SpaceTitle.propTypes = propTypes;
export default SpaceTitle;
