import React from 'react';
import Modal from '../../components/Modal';
import LoadSessionModalContainer from './LoadSessionModalContainer';
import { MODAL_PAGES } from '../../constants';

const propTypes = {
  currentPage: React.PropTypes.string,
};

const ModalContentContainer = (props) => {
  switch (props.currentPage) {
    case MODAL_PAGES.LOAD_SESSION: {
      return <LoadSessionModalContainer />;
    }
    default:
      return <Modal />;
  }
};

ModalContentContainer.propTypes = propTypes;
export default ModalContentContainer;
