import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleModal } from './actions';
import ModalPageContentHandler from './ModalPageContentHandler';

const propTypes = {
  toggleModal: PropTypes.func,
  isVisible: PropTypes.bool,
  currentPage: PropTypes.string,
};

class ModalContainer extends Component {
  constructor(props) {
    super(props);
    this.closeModalOnEscapeButtonPress = this.closeModalOnEscapeButtonPress.bind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('keydown', this.closeModalOnEscapeButtonPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeModalOnEscapeButtonPress);
  }

  closeModalOnEscapeButtonPress(evt) {
    if (evt.keyCode === 27 && this.props.isVisible) {
      this.props.toggleModal();
    }
  }

  render() {
    return (
      <div
        role="dialog"
        className={`ModalContainer${(this.props.isVisible) ? ' active' : ''}`}
      >
        <button
          className="ModalContainer__clickable-bg" onClick={this.props.toggleModal}
          aria-label="close"
        />
        <ModalPageContentHandler currentPage={this.props.currentPage} />
      </div>
    );
  }
}

const mapStateToProps = state => state.modal;
ModalContainer.propTypes = propTypes;

export default connect(mapStateToProps, { toggleModal })(ModalContainer);
