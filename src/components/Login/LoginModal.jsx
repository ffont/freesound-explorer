import PropTypes from 'prop-types';

const propTypes = {
  isVisible: PropTypes.bool,
  contentURL: PropTypes.string,
  setLoginModalVisibility: PropTypes.func,
};

function LoginModal(props) {
  const modalClassName = `login-modal-bg${(props.isVisible) ? ' active' : ''}`;
  const iframeSrc = (props.isVisible) ? props.contentURL : '';
  return (
    <div className={modalClassName}>
      <div className="login-modal">
        <div className="modal-content">
          <div className="modal-close-button">
            <a onClick={() => props.setLoginModalVisibility(false)}>x</a>
          </div>
          <div className="login-form">
            <iframe
              height="400"
              width="500"
              frameBorder="0"
              src={iframeSrc}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

LoginModal.propTypes = propTypes;
export default LoginModal;
