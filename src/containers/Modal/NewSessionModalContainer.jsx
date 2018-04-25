import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import { newSession } from 'containers/SessionsHandler/actions';
import { toggleModal } from './actions';

const propTypes = {
  newSession: PropTypes.func,
  toggleModal: PropTypes.func,
};

const NewSessionModalContainer = props =>
  <ConfirmActionModal
    text="Current session has unsaved data that will be lost. Do you wish to continue?"
    confirmAction={props.newSession}
    cancelAction={props.toggleModal}
  />;

NewSessionModalContainer.propTypes = propTypes;
export default connect(() => ({}), {
  newSession,
  toggleModal,
})(NewSessionModalContainer);
