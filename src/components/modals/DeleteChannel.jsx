import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import socket from '../../utils/socket.js';

function DeleteChannel({ show, modalInfo, hideModal }) {
  const { channel } = modalInfo;
  const handleDelete = (id) => {
    socket.emit('removeChannel', { id }, () => console.log('removed'));
    hideModal();
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>Delete channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>Please confirm</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>Cancel</Button>
        <Button variant="danger" type="submit" onClick={() => handleDelete(channel.id)}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteChannel;
