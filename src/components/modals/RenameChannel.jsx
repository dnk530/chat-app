import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import socket from '../../utils/socket.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

function RenameChannel({ show, modalInfo, hideModal }) {
  const { t } = useTranslation();
  const { channel } = modalInfo;
  const channelsList = useSelector(channelsSelectors.selectAll).map((c) => c.name);
  const f = useFormik({
    initialValues: { text: '' },
    validationSchema: Yup.object().shape({
      text: Yup.string()
        .min(3, 'errors.channelName')
        .max(20, 'errors.channelName')
        .notOneOf(channelsList, 'errors.channelNameNotUnique')
        .required(),
    }),
    onSubmit: ({ text }) => {
      const promise = new Promise((resolve) => {
        socket.emit('renameChannel', { name: text, id: channel.id }, (res) => {
          if (res.status === 'ok') {
            resolve();
            f.resetForm();
            hideModal();
          }
        });
      });
      return promise;
    },
  });

  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Label className="visually-hidden">Enter new channel name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              name="text"
              value={f.values.text}
              onChange={f.handleChange}
              disabled={f.isSubmitting}
              isInvalid={f.touched.text && f.errors.text}
            />
            <Form.Control.Feedback type="invalid">
              {t(f.errors.text)}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          {t('cancel')}
        </Button>
        <Button type="submit" onClick={f.handleSubmit}>
          {t('rename')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RenameChannel;
