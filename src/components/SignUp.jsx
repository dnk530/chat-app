import React from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/index.js';

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, '>3')
    .max(20, '<20')
    .required('required'),
  password: Yup.string()
    .min(6, '>6')
    .required('required'),
  passwordConfirmation: Yup.string()
    .required('required')
    .oneOf([Yup.ref('password')], "Passwords don't match"),
});

function SignUp() {
  const auth = useAuth();

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
                    console.log(values);
                    const { username, password } = values;
                    axios.post('/api/v1/signup', { username, password })
                      .then((res) => {
                        const { token, username } = res.data;
                        localStorage.setItem('userId', JSON.stringify({ token }));
                        actions.resetForm();
                        auth.logIn(username);
                        console.log(res);
                      })
                      .catch((e) => console.log(e));
                  }}
                >
                  {({ handleSubmit, handleChange, values, errors, touched }) => (
                    <Form onSubmit={handleSubmit}>
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