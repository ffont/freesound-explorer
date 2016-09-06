import React from 'react';

class AudioTickListener extends React.Component {
  constructor() {
    super();
    this.tickEventCallback = this.tickEventCallback.bind(this);
  }
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
    window.addEventListener('tick', this.tickEventCallback, false);
  }

  componentWillUnmount() {
    window.removeEventListener('tick', this.tickEventCallback);
  }

  onAudioTick(bar, beat, tick, time) {
    // Compoenents extending AudioTickListener should override this function.
    // Otherwise the following console.log statement will be printed.
    console.log('Tick event', this.constructor.name, bar, beat, tick, time);
  }

  tickEventCallback(evt) {
    this.onAudioTick(evt.detail.bar, evt.detail.beat, evt.detail.tick, evt.detail.time);
  }
}

export default AudioTickListener;
