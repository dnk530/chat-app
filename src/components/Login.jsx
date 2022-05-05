import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => (
  <Formik
    initialValues={{ userName: '', email: '' }}
    validationSchema={Yup.object({
      userName: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    })}
    onSubmit={() => {}}
  >
    <Form>
      <label htmlFor='firstName'>First Name</label>
      <Field name="userName" type="text"></Field>
      <ErrorMessage name="userName"/>
      <label htmlFor='email'>Email</label>
      <Field name="email" type="email"></Field>
      <ErrorMessage name="email"/>
      <button type="submit">Submit</button>
    </Form>
  </Formik>
);

const Login = () => (
  <>
    <h2>Login</h2>
    <LoginForm />
  </>
  
);

export default Login;