import React from 'react';
import PropTypes from 'prop-types';
import { MODAL_PAGES } from 'constants';
import SaveSessionModalContainer from './SaveSessionModalContainer';
import NewSessionModalContainer from './NewSessionModalContainer';
import LoadSessionModalContainer from './LoadSessionModalContainer';

const propTypes = {
  currentPage: PropTypes.string,
};

const ModalContentContainer = (props) => {
  switch (props.currentPage) {
    case MODAL_PAGES.NEW_SESSION:
      return <NewSessionModalContainer />;
    case MODAL_PAGES.SAVE_SESSION:
      return <SaveSessionModalContainer />;
    case MODAL_PAGES.LOAD_SESSION:
      return <LoadSessionModalContainer />;
    default:
      return null;
  }
};

ModalContentContainer.propTypes = propTypes;
export default ModalContentContainer;
