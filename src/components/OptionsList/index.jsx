import React from 'react';
import PropTypes from 'prop-types';
import './OptionsList.scss';

export const makeOption = (icon, name, action, isDisabled = false) =>
  ({ icon, name, action, isDisabled });

const propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    name: PropTypes.string,
    action: PropTypes.func,
    isDisabled: PropTypes.bool,
  })),
  shouldCenterText: PropTypes.bool,
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
