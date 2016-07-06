import React from 'react';
import '../../stylesheets/MessagesBox.scss';
import 'font-awesome/css/font-awesome.min.css';

const propTypes = {
  statusMessage: React.PropTypes.object,
};

function MessagesBox(props) {
  let className = 'message-box';
  const { message, status } = props.statusMessage;
  if (!!message) {
    className += ' active';
  }
  let statusIcon;
  switch (status) {
    case 'info': {
      statusIcon = 'info-circle';
      break;
    }
    case 'success': {
      statusIcon = 'check-circle';
      break;
    }
    case 'error': {
      statusIcon = 'exclamation';
      break;
    }
    default: {
      statusIcon = 'info-circle';
      break;
    }
  }
  return (
    <div className={className}>
      <div className="message-content">
        <i className={`fa fa-${statusIcon}`} aria-hidden></i>
        <span style={{ marginLeft: 20 }}>{message}</span>
      </div>
    </div>
  );
}

MessagesBox.propTypes = propTypes;
export default MessagesBox;
