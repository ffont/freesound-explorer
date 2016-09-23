import React from 'react';
import { connect } from 'react-redux';
import './Modal.scss';
import { toggleModal } from '../../actions/modal';

const propTypes = {
  isVisible: React.PropTypes.bool,
  toggleModal: React.PropTypes.func,
  page: React.PropTypes.string,
};

function Modal(props) {
  return (
    <div
      className={`modal-container${(props.isVisible) ? ' active' : ''}`}
      onClick={props.toggleModal}
    >
      <div className="modal">
        <div className="modal-header">Header</div>
        <div className="modal-body">Body</div>
        <div className="modal-footer">Footer</div>
      </div>
    </div>);
}

Modal.propTypes = propTypes;
const mapStateToProps = (state) => state.modal;

export default connect(mapStateToProps, { toggleModal })(Modal);
