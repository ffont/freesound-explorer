import PropTypes from 'prop-types';
import './InputText.scss';

const propTypes = {
  onTextChange: PropTypes.func,
  onButtonClick: PropTypes.func,
  tabIndex: PropTypes.string,
  placeholder: PropTypes.string,
  buttonIcon: PropTypes.string,
  currentValue: PropTypes.string,
};

const defaultProps = {
  onTextChange: () => {},
  onButtonClick: () => {},
  tabIndex: '0',
  placeholder: '',
  currentValue: '',
};

function InputTextButton(props) {
  return (
    <div className="InputTextButton">
      <input
        className="InputTextButton__input"
        type="text"
        placeholder={props.placeholder}
        onChange={props.onTextChange}
        tabIndex={props.tabIndex}
        value={props.currentValue}
      />
      <button
        tabIndex="0"
        className="InputTextButton__button"
        type="submit"
      >
        <i className={props.buttonIcon} aria-hidden />
      </button>
    </div>
  );
}

InputTextButton.propTypes = propTypes;
InputTextButton.defaultProps = defaultProps;
export default InputTextButton;
