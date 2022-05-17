import React, { useState, useMemo } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import {
  Navbar, Nav, Container, Button,
} from 'react-bootstrap';

import Login from './Login.jsx';
import Home from './Home.jsx';
import NotFound from './404.jsx';

import useAuth from '../hooks/index.js';
import AuthContext from '../contexts/index.js';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => {
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const value = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!loggedIn && userId.token) {
      logIn();
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  return (auth.loggedIn ? children : <Redirect to="/login" />);
}

function LogOutButton() {
  const auth = useAuth();
  return (
    <Button onClick={auth.logOut}>Log out</Button>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container className="d-flex flex-column h-100">
          <Navbar bg="white" className="mb-3 shadow-sm px-2">
            <Container>
              <Navbar.Brand as={Link} to="/">Chat</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <LogOutButton />
              </Nav>
            </Container>
          </Navbar>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
