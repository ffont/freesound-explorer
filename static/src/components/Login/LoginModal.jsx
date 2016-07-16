import React from 'react';

const propTypes = {
  isVisible: React.PropTypes.bool,
  contentURL: React.PropTypes.string,
  setLoginModalVisibility: React.PropTypes.func,
};

function LoginModal(props) {
  const modalClassName = `login-modal-bg${(props.isVisible) ? ' active' : ''}`;
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
              src={props.contentURL}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

LoginModal.propTypes = propTypes;
export default LoginModal;
