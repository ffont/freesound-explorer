import React from 'react';
import '../../stylesheets/SelectWithLabel.scss';

const propTypes = {
  onChange: React.PropTypes.func,
  label: React.PropTypes.string,
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string,
    name: React.PropTypes.string,
  })),
  tabIndex: React.PropTypes.string,
};
const defaultProps = {
  onChange: () => {},
};

function SelectWithLabel(props) {
  return (
    <div className="select-with-label">
      <label htmlFor="select-with-label">{props.label}</label>
      <select
        className="map-descriptors-selector"
        onChange={props.onChange}
        id="select-with-label"
        tabIndex={props.tabIndex}
      >
        {props.options.map((option, index) => (
          <option value={option.value} key={index}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}

SelectWithLabel.propTypes = propTypes;
SelectWithLabel.defaultProps = defaultProps;
export default SelectWithLabel;
