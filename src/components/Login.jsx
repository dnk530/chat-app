import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/index.js';

const routes = {
  login: '/api/v1/login',
};

function LoginForm() {
  const auth = useAuth();
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const f = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: async (values) => {
      const { username, password } = values;
      try {
        setAuthFailed(false);
        const response = await axios.post(routes.login, { username, password });
        const { data: { token } } = response;
        localStorage.setItem('userId', JSON.stringify({ token }));
        f.resetForm();
        auth.logIn(username);
      } catch (e) {
        if (e.code === 'ERR_BAD_REQUEST' && e.response.status === 401) {
          setAuthFailed(true);
          auth.logOut();
        }
        if (e.code === 'ERR_NETWORK') {
          toast.error(t('errors.networkError'));
        }
      }
    },
  });

  return (
    <Form onSubmit={f.handleSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>{t('nickname')}</Form.Label>
        <Form.Control
          name="username"
          placeholder={t('username')}
          autoComplete="username"
          onChange={f.handleChange}
          value={f.values.username}
          isInvalid={authFailed}
          disabled={f.isSubmitting}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>{t('password')}</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder={t('password')}
          autoComplete="current-password"
          onChange={f.handleChange}
          value={f.values.password}
          isInvalid={authFailed}
          disabled={f.isSubmitting}
          required
        />
        <Form.Control.Feedback type="invalid">{t('errors.invalidCredentials')}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="outline-primary" disabled={f.isSubmitting}>{t('enter')}</Button>
    </Form>
  );
}

function Login() {
  const auth = useAuth();
  const { t } = useTranslation();
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>{t('login')}</Card.Title>
              <LoginForm />
            </Card.Body>
            <Card.Footer className="text-center">
              <Card.Link as={Link} to="/signup">{t('register')}</Card.Link>
            </Card.Footer>
          </Card>
          {auth.loggedIn && <Redirect to="/" />}
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
