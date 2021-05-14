import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import '././LoadSessionEntry.scss';

const modalEntryPropTypes = {
  session: PropTypes.object,
  loadSession: PropTypes.func,
  isDemoSession: PropTypes.bool,
  removeSession: PropTypes.func,
};

const LoadSessionEntry = props => {
  const sessionName = props.session.name;
  const sessionAuthor = (props.isDemoSession && props.session.author) || null;
  const date = new Date(props.session.lastModified);
  const removeSessionButton = (props.isDemoSession) ? null :
    <button
      className="LoadSessionEntry__delete-session"
      onClick={() => props.removeSession(props.session.id)}
    ><i className="fa fa-trash-o fa-lg" aria-hidden="true" /></button>;
  return (
    <div className="LoadSessionEntry">
      <button
        className="LoadSessionEntry__button"
        onClick={() => props.loadSession(props.session.id)}
        tabIndex="0"
      />
      <div className="LoadSessionEntry__session-name">{sessionName}</div>
      {(sessionAuthor) ?
        <div className="LoadSessionEntry__session-author-container">
          <div className="LoadSessionEntry__by">by</div>
          <div className="LoadSessionEntry__session-author">{sessionAuthor}</div>
        </div>
        : null
      }
      <div className="LoadSessionEntry__session-date">{dateFormat(date)}</div>
      {removeSessionButton}
    </div>
  );
};
LoadSessionEntry.propTypes = modalEntryPropTypes;
export default LoadSessionEntry;
