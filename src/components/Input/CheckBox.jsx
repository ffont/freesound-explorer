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
};

function CheckBox(props) {
  return (
    <div className="check-box" onClick={props.onChange}>
      <label htmlFor={props.id}>Play on hover</label>
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
    </div>
  );
}

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;
export default CheckBox;
