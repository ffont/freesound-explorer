import { audioContext, BufferLoader } from './audioEngine';

function playingAnimation(svgObject) {
    /* Transitions to be carried out when sound is playing */
  (function repeat() {
      svgObject = svgObject.transition()
          .duration(500)
          .attr('r', default_radius/1.5)
          .transition()
          .duration(500)
          .attr('r', default_radius/2)
          .ease('sine')
          .each('end', (d) => {
            if (d.playing) {
              repeat();
            }
          });
  }());
}

function unselectAllSounds() {
  /* Set all sounds to unselected */
  svg.selectAll('.sound_point').each(function(d){d.unselect(d3.select(this));});
}

export function selectSound(soundID) {
  return selectPoint(soundID).__data__;
}
