import React from 'react';
import ModalTitle from './ModalTitle';
import './LoadSessionModal.scss';

const modalEntryPropTypes = {
  session: React.PropTypes.object,
  loadSession: React.PropTypes.func,
};

const ModalEntry = props =>
  <button onClick={() => props.loadSession(props.session.id)}>
    {props.session.name} | {props.session.lastModified} | {props.session.id}
  </button>;
ModalEntry.propTypes = modalEntryPropTypes;


const propTypes = {
  sessions: React.PropTypes.array,
  loadSession: React.PropTypes.func,
};

const LoadSessionModal = props =>
  <div className="LoadSessionModal">
    <ModalTitle title="Load session" />
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
