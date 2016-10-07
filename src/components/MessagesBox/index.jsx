import React from 'react';
import { MESSAGE_STATUS } from 'constants';
import './MessagesBox.scss';

const propTypes = {
  message: React.PropTypes.string,
  status: React.PropTypes.string,
  className: React.PropTypes.string,
};

const MessagesBox = (props) => {
  const { message, status, className } = props;
  const containerClass = `${className} ${status}`;
  let statusIcon;
  switch (status) {
    case MESSAGE_STATUS.INFO: {
      statusIcon = 'info-circle';
      break;
    }
    case MESSAGE_STATUS.SUCCESS: {
      statusIcon = 'check-circle';
      break;
    }
    case MESSAGE_STATUS.ERROR: {
      statusIcon = 'exclamation';
      break;
    }
    default: {
      statusIcon = 'info-circle';
      break;
    }
  }
  return (
    <div className={containerClass}>
      <div className="message-content">
        <i className={`fa fa-${statusIcon}`} aria-hidden />
        <span style={{ marginLeft: 20 }}>{message}</span>
      </div>
    </div>
  );
};

MessagesBox.propTypes = propTypes;
export default (MessagesBox);
