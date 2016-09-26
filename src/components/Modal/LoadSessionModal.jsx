import React from 'react';

const modalEntryPropTypes = {
  session: React.PropTypes.object,
  loadSession: React.PropTypes.func,
};

const ModalEntry = props =>
  <div onClick={() => props.loadSession(props.session.id)}>
    {props.session.name} | {props.session.lastModified} | {props.session.id}
  </div>;
ModalEntry.propTypes = modalEntryPropTypes;


const propTypes = {
  sessions: React.PropTypes.array,
  loadSession: React.PropTypes.func,
};

const LoadSessionModal = props =>
  <div className="modal">
    {props.sessions.map(session =>
      <ModalEntry
        key={session.id}
        loadSession={props.loadSession}
        session={session}
      />
    )}
  </div>;

LoadSessionModal.propTypes = propTypes;
export default LoadSessionModal;
