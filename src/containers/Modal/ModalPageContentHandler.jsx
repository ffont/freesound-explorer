import React from 'react';
import Modal from 'components/Modal/index.jsx';
import { MODAL_PAGES } from 'constants';
import LoadSessionModalContainer from './LoadSessionModalContainer';

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
