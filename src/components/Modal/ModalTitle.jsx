import PropTypes from 'prop-types';
import './ModalTitle.scss';

const propTypes = {
  title: PropTypes.string,
};

const ModalTitle = props =>
  <div className="ModalTitle">{props.title}</div>;

ModalTitle.propTypes = propTypes;
export default ModalTitle;
