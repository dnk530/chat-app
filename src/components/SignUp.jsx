import React, { useRef } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/index.js';

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Must be longer than 3')
    .max(20, 'Must be shorter than 20')
    .required('required'),
  password: Yup.string()
    .min(6, 'Must be longer than 6')
    .required('required'),
  passwordConfirmation: Yup.string()
    .required('required')
    .oneOf([Yup.ref('password')], "Passwords don't match"),
});

function SignUp() {
  const auth = useAuth();
  const usernameRef = useRef(null);

  return (auth.loggedIn
    ? <Redirect to="/" />
    : (
      <Container fluid className="h-100">
        <Row className="h-100 justify-content-center align-items-center">
          <Col md={8} xl={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Register</Card.Title>
                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                    passwordConfirmation: '',
                  }}
                  validationSchema={signupSchema}
                  onSubmit={(values, actions) => {
                    const { username, password } = values;
                    axios.post('/api/v1/signup', { username, password })
                      .then((res) => {
                        const { token } = res.data;
                        localStorage.setItem('userId', JSON.stringify({ token }));
                        actions.resetForm();
                        actions.setSubmitting(false);
                        auth.logIn(username);
                      })
                      .catch((e) => {
                        if (e.response.status === 409) {
                          actions.setErrors({ username: 'user already exists' });
                          actions.setSubmitting(false);
                          usernameRef.current.focus();
                        }
                      });
                  }}
                >
                  {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      <fieldset disabled={isSubmitting}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="username">
                            Username
                          </Form.Label>
                          <Form.Control
                            name="username"
                            type="text"
                            value={values.username}
                            onChange={handleChange}
                            isInvalid={touched.username && errors.username}
                            ref={usernameRef}
                          />
                          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="password">
                            Password
                          </Form.Label>
                          <Form.Control
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="passwordConfirmation">
                            Confirm password
                          </Form.Label>
                          <Form.Control
                            name="passwordConfirmation"
                            type="password"
                            value={values.passwordConfirmation}
                            onChange={handleChange}
                            isInvalid={touched.passwordConfirmation && errors.passwordConfirmation}
                          />
                          <Form.Control.Feedback type="invalid">{errors.passwordConfirmation}</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" variant="outline-primary">Register</Button>
                      </fieldset>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  );
}

export default SignUp;
