import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/Modal';
import LoadSessionModal from '../../components/Modal/LoadSessionModal';
import { MODAL_PAGES } from '../../constants';

const propTypes = {
  currentPage: React.PropTypes.string,
};

const ModalContentContainer = (props) => {
  switch (props.currentPage) {
    case MODAL_PAGES.LOAD_SESSION: {
      return <LoadSessionModal />;
    }
    default:
      return <Modal />;
  }
};

ModalContentContainer.propTypes = propTypes;
export default connect(() => ({}), {})(ModalContentContainer);
