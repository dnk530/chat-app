import React, { useRef } from 'react';
import {
  Container, Row, Col, Form, Card, Button,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

function SignUp() {
  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'errors.usernameField')
      .max(20, 'errors.usernameField')
      .required(),
    password: Yup.string()
      .min(6, 'errors.passwordField')
      .required(),
    passwordConfirmation: Yup.string()
      .required()
      .oneOf([Yup.ref('password')], 'errors.passwordConfirmation'),
  });

  const auth = useAuth();
  const usernameRef = useRef(null);
  const { t } = useTranslation();

  return auth.user.loggedIn ? (
    <Redirect to={routes.homePagePath()} />
  ) : (
    <Container fluid className="h-100">
      <Row className="h-100 justify-content-center align-items-center">
        <Col md={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>{t('registration')}</Card.Title>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  passwordConfirmation: '',
                }}
                validationSchema={signupSchema}
                onSubmit={(values, actions) => {
                  const { username, password } = values;
                  axios
                    .post(routes.signupPath(), { username, password })
                    .then((res) => {
                      const { token } = res.data;
                      actions.resetForm();
                      actions.setSubmitting(false);
                      auth.logIn({ username, token });
                    })
                    .catch((e) => {
                      if (e.response.status === 409) {
                        actions.setErrors({
                          username: 'errors.userAlreadyExists',
                        });
                        actions.setSubmitting(false);
                        usernameRef.current.focus();
                      }
                      if (e.code === 'ERR_NETWORK') {
                        toast.error(t('errors.networkError'));
                        actions.setSubmitting(false);
                      }
                    });
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <fieldset disabled={isSubmitting}>
                      <Form.Group className="mb-3" controlId="username">
                        <Form.Label>{t('username')}</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="username"
                          value={values.username}
                          onChange={handleChange}
                          isInvalid={touched.username && errors.username}
                          ref={usernameRef}
                        />
                        {errors.username && (
                        <Form.Control.Feedback type="invalid">
                          {t(errors.username)}
                        </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>{t('password')}</Form.Label>
                        <Form.Control
                          type="password"
                          autoComplete="new-password"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={touched.password && errors.password}
                        />
                        {errors.password && (
                          <Form.Control.Feedback type="invalid">
                            {t(errors.password)}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="passwordConfirmation"
                      >
                        <Form.Label>{t('confirmPassword')}</Form.Label>
                        <Form.Control
                          type="password"
                          autoComplete="new-password"
                          value={values.passwordConfirmation}
                          onChange={handleChange}
                          isInvalid={
                            touched.passwordConfirmation
                            && errors.passwordConfirmation
                          }
                        />
                        {errors.passwordConfirmation && (
                          <Form.Control.Feedback type="invalid">
                            {t(errors.passwordConfirmation)}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      <Button type="submit" variant="outline-primary">
                        {t('register')}
                      </Button>
                    </fieldset>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
