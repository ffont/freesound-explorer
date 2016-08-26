import React from 'react';
import '../../stylesheets/OptionsList.scss';

export const makeOption = (icon, name, action) => ({ icon, name, action });

const propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    icon: React.PropTypes.string,
    name: React.PropTypes.string,
    action: React.PropTypes.func,
  })),
};

const OptionsList = (props) => (
  <ol className="options-list">
    {props.options.map((option, index) => (
      <li tabIndex={index + 1} key={option.name} onClick={option.action}>
        <i className={`fa fa-lg fa-${option.icon}`} />{option.name}
      </li>
    ))}
  </ol>
);

OptionsList.propTypes = propTypes;
export default OptionsList;
