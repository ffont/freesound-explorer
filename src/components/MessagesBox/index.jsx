import React from 'react';
import PropTypes from 'prop-types';
import { MESSAGE_STATUS } from 'constants';
import './MessagesBox.scss';

const propTypes = {
  message: PropTypes.string,
  status: PropTypes.string,
  className: PropTypes.string,
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
