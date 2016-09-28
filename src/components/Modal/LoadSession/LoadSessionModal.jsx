import React from 'react';
import ModalTitle from '../ModalTitle';
import LoadSessionEntry from './LoadSessionEntry';
import './LoadSessionModal.scss';


const propTypes = {
  userSessions: React.PropTypes.array,
  demoSessions: React.PropTypes.array,
  loadSession: React.PropTypes.func,
  deleteSession: React.PropTypes.func,
};

const LoadSessionModal = props =>
  <div className="LoadSessionModal">
    <ModalTitle title="Load session" />
    <div className="LoadSessionModal__user-sessions">
      {props.userSessions.map(session =>
        <LoadSessionEntry
          key={session.id}
          loadSession={props.loadSession}
          session={session}
          deleteSession={props.deleteSession}
        />
      )}
    </div>
    <div className="LoadSessionModal__demo-sessions">
      {props.demoSessions.map(session =>
        <LoadSessionEntry
          key={session.id}
          loadSession={props.loadSession}
          session={session}
          isDemoSession
        />
      )}
    </div>
  </div>;

LoadSessionModal.propTypes = propTypes;
export default LoadSessionModal;
