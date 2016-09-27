import React from 'react';
import './ModalTitle.scss';

const propTypes = {
  title: React.PropTypes.string,
};

const ModalTitle = props =>
  <div className="ModalTitle">{props.title}</div>;

ModalTitle.propTypes = propTypes;
export default ModalTitle;
