import React from 'react';
import { connect } from 'react-redux';
import { toggleModal } from './actions';
import ModalContentContainer from './ModalContentContainer';
import Modal from '../../components/Modal';

const propTypes = {
  toggleModal: React.PropTypes.func,
  isVisible: React.PropTypes.bool,
  currentPage: React.PropTypes.string,
};

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.closeModalOnEscapeButtonPress = this.closeModalOnEscapeButtonPress.bind(this);
  }

  componentWillMount() {
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
        <ModalContentContainer currentPage={this.props.currentPage} />
      </div>
    );
  }
}

const mapStateToProps = state => state.modal;
ModalContainer.propTypes = propTypes;

export default connect(mapStateToProps, { toggleModal })(ModalContainer);
