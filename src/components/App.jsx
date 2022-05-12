import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'

import Login from './Login.jsx';
import getData from '../utils/fetcher.js';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => {
    setLoggedIn(true);
  }
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!loggedIn && userId.token) {
      logIn();
    }
  } catch (error) {
    
  }

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
};



export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" className="mb-3">
          <Navbar.Brand as={Link} to={"/"}>Chat</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Navbar>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path='*'>
              <NotFound />
            </Route>
          </Switch>
      </Router>
    </AuthProvider>
  );
}

const Home = () => {
  const useAuth = useContext(AuthContext);
  useEffect(() => {
    if (!useAuth.loggedIn) {
      return null;
    }
    getData();
  }, [])

  return (
    <Container>
      <Row>
        <Col>
          <h2>Home</h2>
          {useAuth.loggedIn ? <p>authorized</p> : <Redirect to="/login"></Redirect>}

        </Col>
      </Row>
    </Container>
)};
const NotFound = () => <h2>404</h2>;
