import React from 'react';
import './ConfirmActionModal.scss';

const propTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string,
  confirmAction: React.PropTypes.func,
  cancelAction: React.PropTypes.func,
  confirmActionTitle: React.PropTypes.string,
  cancelActionTitle: React.PropTypes.string,
};

const defaultProps = {
  confirmActionTitle: 'Confirm',
  cancelActionTitle: 'Cancel',
};

const ConfirmActionModal = props =>
  <div className="ConfirmActionModal">
    {props.text}
  </div>;

ConfirmActionModal.propTypes = propTypes;
ConfirmActionModal.defaultProps = defaultProps;
export default ConfirmActionModal;
