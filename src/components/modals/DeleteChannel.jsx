import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import socket from '../../utils/socket.js';

function DeleteChannel({ show, modalInfo, hideModal }) {
  const { t } = useTranslation();
  const { channel } = modalInfo;
  const handleDelete = (id) => {
    socket.emit('removeChannel', { id }, () => console.log('removed'));
    hideModal();
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('confirmPrompt')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
        <Button variant="danger" type="submit" onClick={() => handleDelete(channel.id)}>{t('delete')}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteChannel;
