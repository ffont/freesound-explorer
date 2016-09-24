import React from 'react';

const modalEntryPropTypes = {
  session: React.PropTypes.object,
  loadSession: React.PropTypes.func,
  userID: React.PropTypes.string,
};

const ModalEntry = props =>
  <div onClick={() => props.loadSession(props.session.id, props.userID)}>
    {props.session.id}
  </div>;
ModalEntry.propTypes = modalEntryPropTypes;


const propTypes = {
  sessions: React.PropTypes.array,
  loadSession: React.PropTypes.func,
  userID: React.PropTypes.string,
};

const LoadSessionModal = props =>
  <div className="modal">
    {props.sessions.map(session =>
      <ModalEntry
        key={session.id}
        loadSession={props.loadSession}
        session={session}
        userID={props.userID}
      />
    )}
  </div>;

LoadSessionModal.propTypes = propTypes;
export default LoadSessionModal;
