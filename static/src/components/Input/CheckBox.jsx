import React from 'react';
import '../../stylesheets/CheckBox.scss';

const propTypes = {
  checked: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  label: React.PropTypes.string,
  tabIndex: React.PropTypes.string,
};

const defaultProps = {
  onChange: () => {},
};

function CheckBox(props) {
  return (
    <div className="check-box">
      <label htmlFor="check-box">Play on hover</label>
      <input
        id="check-box"
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        tabIndex={props.tabIndex}
      />
      <span
        className={`box${(props.checked) ? ' active' : ''}`}
        onClick={props.onChange}
      />
    </div>
  );
}

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;
export default CheckBox;
