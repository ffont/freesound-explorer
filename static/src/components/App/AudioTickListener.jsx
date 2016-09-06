import React from 'react';

class AudioTickListener extends React.Component {
  /*
  Components extending AudioTickListener will receive tick events.
  On each tick the function 'onAudioTick' will be called with information about current
  bar, beat, tick and time (the audio contenxt time at which this tick will happen).
  Components extending AudioTickListener should override onAudioTick to decide what to do with
  the tick information.
  This abstract component is used to sync audio events with the global tempo defined in
  Metronome component.
  */
  componentDidMount() {
    window.addEventListener('tick', (e) => {
      this.onAudioTick(e.detail.bar, e.detail.beat, e.detail.tick, e.detail.time);
    }, false);
  }
  componentWillUnmount() {
    window.removeEventListener('tick', () => {});
  }
  onAudioTick(bar, beat, tick, time) {
    // Compoenents extending AudioTickListener should override this function.
    // Otherwise the following console.log statement will be printed.
    console.log('Tick event', this.constructor.name, bar, beat, tick, time);
  }
}

export default AudioTickListener;
