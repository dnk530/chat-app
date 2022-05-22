import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import socket from '../../utils/socket.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../../slices/channelsSlice.js';

function AddChannel({ show, hideModal }) {
  const dispatch = useDispatch();
  const channelsList = useSelector(channelsSelectors.selectAll).map((c) => c.name);
  const f = useFormik({
    initialValues: { text: '' },
    validationSchema: Yup.object().shape({
      text: Yup.string()
        .min(3, 'Channel name should be longer than 3 characters')
        .max(20, 'Channel name should be shorter than 20 characters')
        .notOneOf(channelsList, 'Channel with this name already exists')
        .required('This field is required'),
    }),
    onSubmit: ({ text }) => {
      console.log('errors: ', f.errors);
      const promise = new Promise((resolve, reject) => {
        socket.emit('newChannel', { name: text }, ({ status, data }) => {
          if (status === 'ok') {
            resolve();
            f.resetForm();
            hideModal();
            dispatch(channelsActions.addChannel(data));
            dispatch(channelsActions.setCurrentChannelId(data.id));
          }
        });
      });
      return promise;
    },
  });

  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={hideModal}>
        <Modal.Title>Add channel</Modal.Title>
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
              {f.errors.text}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={f.handleSubmit}
          disabled={f.isSubmitting}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddChannel;
