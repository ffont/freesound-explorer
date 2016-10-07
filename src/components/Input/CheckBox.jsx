import React from 'react';
import './CheckBox.scss';

const propTypes = {
  checked: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  label: React.PropTypes.string,
  tabIndex: React.PropTypes.string,
  id: React.PropTypes.string,
};

const defaultProps = {
  onChange: () => {},
  id: 'check-box',
  tabIndex: '0',
};

function CheckBox(props) {
  return (
    <label
      className="CheckBox__label"
      htmlFor={props.id}
    >
      {props.label}
      <input
        id={props.id}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        tabIndex={props.tabIndex}
      />
      <span
        className={`box${(props.checked) ? ' active' : ''}`}
      />
    </label>
  );
}

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;
export default CheckBox;
