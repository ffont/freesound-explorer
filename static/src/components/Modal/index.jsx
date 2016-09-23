import React from 'react';
import './Modal.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  toggleModal: React.PropTypes.func,
  currentPage: React.PropTypes.string,
};

function Modal() {
  return (
    <div className="modal">
      <div className="modal-header">Header</div>
      <div className="modal-body">Body</div>
      <div className="modal-footer">Footer</div>
    </div>
  );
}

Modal.propTypes = propTypes;
export default Modal;
