import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useApi } from '../../hooks/index.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

function RenameChannel({ show, modalInfo, hideModal }) {
  const inputRef = useRef(null);
  const api = useApi();
  const { t } = useTranslation();
  const { channel } = modalInfo;
  const channelsList = useSelector(channelsSelectors.selectAll).map((c) => c.name);
  const f = useFormik({
    initialValues: { newChannelName: '' },
    validationSchema: Yup.object().shape({
      newChannelName: Yup.string()
        .min(3, 'errors.channelName')
        .max(20, 'errors.channelName')
        .notOneOf(channelsList, 'errors.channelNameNotUnique')
        .required(),
    }),
    onSubmit: ({ newChannelName }) => {
      const newChannel = { name: newChannelName, id: channel.id };
      const promise = new Promise((resolve) => {
        api.renameChannel(newChannel, (err) => {
          if (err) {
            toast.error(t('errors.networkError'));
            return;
          }
          resolve();
          f.resetForm();
          hideModal();
          toast.success(t('notifications.channelRenamed'));
        });
      });
      return promise;
    },
  });

  return (
    <Modal
      show={show}
      onEntered={() => {
        inputRef.current.focus();
        inputRef.current.value = channel.name;
        inputRef.current.select();
      }}
    >
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group controlId="newChannelName">
            <Form.Label className="visually-hidden">
              {t('channelName')}
            </Form.Label>
            <Form.Control
              type="text"
              ref={inputRef}
              value={f.values.newChannelName}
              onChange={f.handleChange}
              disabled={f.isSubmitting}
              isInvalid={f.touched.newChannelName && f.errors.newChannelName}
            />
            <Form.Control.Feedback type="invalid">
              {t(f.errors.newChannelName)}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          {t('cancel')}
        </Button>
        <Button type="submit" onClick={f.handleSubmit}>
          {t('send')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RenameChannel;
