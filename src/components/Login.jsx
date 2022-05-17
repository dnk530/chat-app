import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import useAuth from '../hooks/index.js';

const routes = {
  login: '/api/v1/login',
};

function LoginForm() {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: async (values) => {
      const { username, password } = values;
      try {
        setAuthFailed(false);
        const response = await axios.post(routes.login, { username, password });
        const { data } = response;
        localStorage.setItem('userId', JSON.stringify(data));
        formik.resetForm();
        auth.logIn();
      } catch (error) {
        setAuthFailed(true);
        auth.logOut();
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          placeholder="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          isInvalid={authFailed}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={authFailed}
          required
        />
        <Form.Control.Feedback type="invalid">Invalid username/password</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

function Login() {
  const auth = useAuth();
  return (
    <>
      <h2 className="mb-5">Login</h2>
      <Container>
        <Row>
          <Col md={6}>
            <LoginForm />
            {auth.loggedIn && <Redirect to="/" />}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;