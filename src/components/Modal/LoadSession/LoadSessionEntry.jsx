import React from 'react';

const modalEntryPropTypes = {
  session: React.PropTypes.object,
  loadSession: React.PropTypes.func,
  isDemoSession: React.PropTypes.bool,
  deleteSession: React.PropTypes.func,
};

const LoadSessionEntry = props => {
  const sessionName = `"${props.session.name}"`;
  const sessionAuthor = (props.isDemoSession && props.session.author) || null;
  const date = props.session.lastModified.slice(0, -10);
  const deleteSessionButton = (props.isDemoSession) ?
    <button
      className="LoadSessionEntry__delete-session"
      onClick={() => props.deleteSession()}
    >Delete</button> : null;
  return (
    <div className="LoadSessionEntry">
      <button
        className="LoadSessionEntry__button"
        onClick={() => props.loadSession(props.session.id)}
      />
      <div className="LoadSessionEntry__session-name">{sessionName}</div>
      <div className="LoadSessionEntry__by">by</div>
      <div className="LoadSessionEntry__session-author">{sessionAuthor}</div>
      <div className="LoadSessionEntry__session-date">{date}</div>
      {deleteSessionButton}
    </div>
  );
};
LoadSessionEntry.propTypes = modalEntryPropTypes;
export default LoadSessionEntry;
