import PropTypes from 'prop-types';
import './ConfirmActionModal.scss';

const propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  confirmAction: PropTypes.func,
  cancelAction: PropTypes.func,
  confirmActionTitle: PropTypes.string,
  cancelActionTitle: PropTypes.string,
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
