import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SaveSessionModal from 'components/Modal/SaveSessionModal';
import { saveSessionAs } from '../SessionsHandler/actions';

const propTypes = {
  saveSessionAs: PropTypes.func,
  currentSessionName: PropTypes.string,
};

const SaveSessionModalContainer = props => (
  <SaveSessionModal
    saveSessionAs={props.saveSessionAs}
    currentSessionName={props.currentSessionName}
  />
);

const mapStateToProps = state => ({ currentSessionName: state.session.name });

SaveSessionModalContainer.propTypes = propTypes;
export default connect(mapStateToProps, {
  saveSessionAs,
})(SaveSessionModalContainer);
