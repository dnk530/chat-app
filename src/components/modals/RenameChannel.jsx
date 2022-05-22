import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import socket from '../../utils/socket.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

function RenameChannel({ show, modalInfo, hideModal }) {
  const { channel } = modalInfo;
  const channelsList = useSelector(channelsSelectors.selectAll).map((c) => c.name);
  const f = useFormik({
    initialValues: { text: '' },
    validationSchema: Yup.object().shape({
      text: Yup.string()
        .min(3, '> 3')
        .max(20, '< 20')
        .notOneOf(channelsList, 'Channel with this name already exists')
        .required('required'),
    }),
    onSubmit: ({ text }) => {
      const promise = new Promise((resolve, reject) => {
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
        <Modal.Title>Rename channel</Modal.Title>
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
              {f.errors.text}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button type="submit" onClick={f.handleSubmit}>
          Rename
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RenameChannel;
