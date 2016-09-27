import React from 'react';
import './InputText.scss';

const propTypes = {
  onTextChange: React.PropTypes.func,
  onButtonClick: React.PropTypes.func,
  tabIndex: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  buttonIcon: React.PropTypes.string,
  value: React.PropTypes.string,
};

const defaultProps = {
  onTextChange: () => {},
  onButtonClick: () => {},
  tabIndex: '0',
  placeholder: '',
  value: '',
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
        value={props.value}
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
