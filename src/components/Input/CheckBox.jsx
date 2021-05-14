import PropTypes from 'prop-types';
import './CheckBox.scss';

const propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  tabIndex: PropTypes.string,
  id: PropTypes.string,
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
