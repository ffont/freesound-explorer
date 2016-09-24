import React from 'react';
import './SelectWithLabel.scss';

const propTypes = {
  onChange: React.PropTypes.func,
  label: React.PropTypes.string,
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string,
    name: React.PropTypes.string,
  })),
  tabIndex: React.PropTypes.string,
  defaultValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number]),
  id: React.PropTypes.string,
};
const defaultProps = {
  onChange: () => {},
  id: 'select-with-label',
};

function SelectWithLabel(props) {
  return (
    <div className="select-with-label">
      <label htmlFor={props.id}>{props.label}</label>
      <select
        className="map-descriptors-selector"
        onChange={props.onChange}
        id={props.id}
        tabIndex={props.tabIndex}
        defaultValue={props.defaultValue}
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
