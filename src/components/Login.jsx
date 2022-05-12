import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';

const routes = {
  login: '/api/v1/login',
}

const LoginForm = () => {

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={Yup.object({
        username: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
        password: Yup.string().required('Required').min(5, 'Must be 5 chars or more'),
      })}
      onSubmit={ async (values, actions) => {
        const { username, password } = values;
        try {
          const response = await axios.post(routes.login, { username, password });
          const { data: { token }} = response;
          localStorage.setItem('userId', JSON.stringify({ token }));
          actions.resetForm();
        } catch (error) {
          console.log(error);
          actions.setErrors({ username: 'Wrong username or password', password: 'Wrong username of password'});
        }
      }}
    >
      <Form>
        <label htmlFor='username'>Username</label>
        <Field name="username" type="text"></Field>
        <ErrorMessage name="username"/>
        <label htmlFor='password'>Password</label>
        <Field name="password" type="password"></Field>
        <ErrorMessage name="password"/>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
 

const Login = () => (
  <>
    <h2>Login</h2>
    <Container>
      <Row>
        <Col>
          TEXT
        </Col>
      </Row>
    </Container>
    <LoginForm />
  </>
  
);

export default Login;