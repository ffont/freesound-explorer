import React from 'react';
import '../../stylesheets/InputText.scss';

const propTypes = {
  onTextChange: React.PropTypes.func,
  onButtonClick: React.PropTypes.func,
  tabIndex: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  buttonIcon: React.PropTypes.string,
};

const defaultProps = {
  onTextChange: () => {},
  onButtonClick: () => {},
  tabIndex: 1,
  placeholder: '',
};

function InputTextButton(props) {
  return (
    <div>
      <input
        className="input-text-button"
        type="text"
        placeholder={props.placeholder}
        onChange={props.onTextChange}
        tabIndex="1"
      />
      <button
        onClick={props.onButtonClick}
      >
        <i className={props.buttonIcon} aria-hidden="true" />
      </button>
    </div>
  );
}

InputTextButton.propTypes = propTypes;
InputTextButton.defaultProps = defaultProps;
export default InputTextButton;
