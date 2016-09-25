import React from 'react';
import './OptionsList.scss';

export const makeOption = (icon, name, action) => ({ icon, name, action });

const propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    icon: React.PropTypes.string,
    name: React.PropTypes.string,
    action: React.PropTypes.func,
  })),
  centerText: React.PropTypes.bool,
};

const OptionsList = props => (
  <ol className="OptionsList">
    {props.options.map(option => (
      <li key={option.name}>
        <button
          className={`OptionsList__clickable-option${(props.centerText) ? ' centered' : ''}`}
          tabIndex="0"
          onClick={option.action}
        >
          <i className={`fa fa-lg fa-${option.icon}`} />{option.name}
        </button>
      </li>
    ))}
  </ol>
);

OptionsList.propTypes = propTypes;
export default OptionsList;
