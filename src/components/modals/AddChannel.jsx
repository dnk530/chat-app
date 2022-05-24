import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import socket from '../../utils/socket.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../../slices/channelsSlice.js';

function AddChannel({ show, hideModal }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
        socket.emit('newChannel', { name: text }, ({ status, data }) => {
          if (status === 'ok') {
            resolve();
            f.resetForm();
            hideModal();
            dispatch(channelsActions.addChannel(data));
            dispatch(channelsActions.setCurrentChannelId(data.id));
            toast.success(t('notifications.channelAdded'));
          }
        });
      });
      return promise;
    },
  });

  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Label className="visually-hidden">
              Enter channel name
            </Form.Label>
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
        <Button
          type="submit"
          onClick={f.handleSubmit}
          disabled={f.isSubmitting}
        >
          {t('send')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddChannel;
