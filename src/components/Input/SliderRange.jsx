import React from 'react';
import { sidebarClosedOffset } from 'stylesheets/variables.json';
import './SliderRange.scss';

const propTypes = {
  currentValue: React.PropTypes.number,
  minValue: React.PropTypes.string,
  maxValue: React.PropTypes.string,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  step: React.PropTypes.string,
  tabIndex: React.PropTypes.string,
  id: React.PropTypes.string,
};

const defaultProps = {
  minValue: 0,
  maxValue: 100,
  currentValue: 0,
  onChange: () => {},
  label: '',
  step: '1',
  id: 'slider-range-input',
};

class SliderRange extends React.Component {
  componentDidMount() {
    // hack to ensure adjustPositionWithThumbWidth gets called correctly
    this.forceUpdate();
  }

  getThumbLabelStyle() {
    let position = this.computePosition();
    position = this.adjustPositionWithThumbWidth(position);
    return {
      left: position,
    };
  }

  computePosition() {
    const { currentValue, minValue, maxValue } = this.props;
    const position = (currentValue - minValue) / (maxValue - minValue);
    return position;
  }

  adjustPositionWithThumbWidth(position) {
    if (this.input) {
      const rangeWidth = parseInt(getComputedStyle(this.input).width, 10);
      const thumbWidth = parseInt(sidebarClosedOffset, 10);
      return (rangeWidth * position) + ((0.5 - position) * thumbWidth);
    }
    return 0;
  }

  render() {
    return (
      <div className="SliderRange">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <div className="SliderRange-wrapper">
          <input
            id={this.props.id}
            type="range"
            step={this.props.step}
            min={this.props.minValue}
            max={this.props.maxValue}
            onChange={this.props.onChange}
            ref={(input) => { this.input = input; }}
            value={this.props.currentValue}
            tabIndex={this.props.tabIndex}
          />
          <span style={this.getThumbLabelStyle()}>{this.props.currentValue}</span>
        </div>
      </div>
    );
  }
}

SliderRange.propTypes = propTypes;
SliderRange.defaultProps = defaultProps;
export default SliderRange;
