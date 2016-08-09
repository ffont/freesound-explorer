import React from 'react';
import { connect } from 'react-redux';
import '../../stylesheets/MessagesBox.scss';
import { DEFAULT_MESSAGE_DURATION, MESSAGE_STATUS } from '../../constants';

const DEFAULT_CLASSNAME = 'message-box';

const propTypes = {
  message: React.PropTypes.string,
  status: React.PropTypes.string,
  messageCount: React.PropTypes.number,
};

class MessagesBox extends React.Component {
  constructor(props) {
    super(props);
    this.visibilityTimeout = undefined;
    this.className = DEFAULT_CLASSNAME;
  }

  shouldComponentUpdate(nextProps) {
    // update component only when receiving a new message
    if (this.props.messageCount !== nextProps.messageCount) {
      clearTimeout(this.visibilityTimeout);
      this.handleTimedVisibility();
      return true;
    }
    return false;
  }

  handleTimedVisibility() {
    this.className = `${DEFAULT_CLASSNAME} active`;
    this.visibilityTimeout = setTimeout(() => {
      this.hideMessage();
    }, DEFAULT_MESSAGE_DURATION);
  }

  hideMessage() {
    this.className = DEFAULT_CLASSNAME;
    this.forceUpdate();
  }

  render() {
    const { message, status } = this.props;
    const className = `${this.className} ${status}`;
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
      <div className={className}>
        <div className="message-content">
          <i className={`fa fa-${statusIcon}`} aria-hidden />
          <span style={{ marginLeft: 20 }}>{message}</span>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => state.messagesBox;

MessagesBox.propTypes = propTypes;
export default connect(mapStateToProps, {})(MessagesBox);
