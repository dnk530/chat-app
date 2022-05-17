import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';

function NewMessageForm() {
  const f = useFormik({
    initialValues: { text: '' },
    onSubmit: (values) => {
      console.log(values.text);
      f.resetForm();
    },
  });

  return (
    <Form onSubmit={f.handleSubmit}>
      <Form.Group className="d-flex">
        <Form.Control
          type="text"
          name="text"
          aria-label="New message"
          placeholder="Enter your message..."
          value={f.values.text}
          onChange={f.handleChange}
        />
        <Button type="Submit" className="mx-2">
          Send
        </Button>
      </Form.Group>
    </Form>
  );
}

export default NewMessageForm;
