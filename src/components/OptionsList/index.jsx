import React from 'react';
import './OptionsList.scss';

export const makeOption = (icon, name, action, isDisabled = false) =>
  ({ icon, name, action, isDisabled });

const propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    icon: React.PropTypes.string,
    name: React.PropTypes.string,
    action: React.PropTypes.func,
    isDisabled: React.PropTypes.bool,
  })),
  shouldCenterText: React.PropTypes.bool,
};

const OptionsList = props => (
  <ol className="OptionsList">
    {props.options.map((option) => {
      const centeredClass = (props.shouldCenterText) ? ' centered' : '';
      const buttonClassName = `OptionsList__clickable-option${centeredClass}`;
      return (
        <li key={option.name}>
          <button
            className={buttonClassName}
            tabIndex="0"
            onClick={option.action}
            disabled={option.isDisabled}
          >
            <i className={`fa fa-lg fa-${option.icon}`} />{option.name}
          </button>
        </li>
      );
    })}
  </ol>
);

OptionsList.propTypes = propTypes;
export default OptionsList;
