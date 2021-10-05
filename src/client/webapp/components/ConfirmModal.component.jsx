import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

function ConfirmModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const onConfirm = () => {
    handleClose(false);
    props.onConfirm();
  };
  const handleShow = () => setShow(true);

  const variant = props.variant || 'danger';

  return (
    <>
      <Button variant={variant} style={{ float: 'right' }} onClick={handleShow}>
        {props.buttonText}
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalHeader || 'Are you sure?'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.modalText}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfirmModal.propTypes = {
  modalHeader: PropTypes.string,
  modalText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  variant: PropTypes.string,
  onConfirm: PropTypes.func,
};

export default ConfirmModal;
