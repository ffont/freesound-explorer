import React from 'react';
import PropTypes from 'prop-types';
import './SelectWithLabel.scss';

const propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
  })),
  tabIndex: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number]),
  id: PropTypes.string,
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
