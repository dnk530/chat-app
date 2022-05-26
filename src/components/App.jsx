import React, { useState, useMemo } from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';

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
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Login from './Login.jsx';
import Home from './Home.jsx';
import NotFound from './404.jsx';

import useAuth from '../hooks/index.js';
import AuthContext from '../contexts/index.js';
import SignUp from './SignUp.jsx';
import LanguageSelect from './LanguageSelect.jsx';

const rollbarConfig = {
  accessToken: process.env.POST_CLIENT_ITEM_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
  },
};

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const logIn = (loggedInUsername) => {
    setLoggedIn(true);
    setUsername(loggedInUsername);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setUsername(null);
  };

  const value = useMemo(() => ({
    loggedIn,
    logIn,
    logOut,
    username,
  }), [loggedIn, username]);

  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!loggedIn && userId.token) {
      logIn(userId.username);
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
  const { t } = useTranslation();
  const auth = useAuth();
  return auth.loggedIn && <Button onClick={auth.logOut} className="text-nowrap">{t('logout')}</Button>;
}

function App() {
  const { t } = useTranslation();
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Container fluid className="d-flex flex-column p-0 h-100">
              <Navbar bg="white" className="mb-3 shadow-sm px-2">
                <Container>
                  <Navbar.Brand as={Link} to="/">{t('appName')}</Navbar.Brand>
                  <Nav className="mr-auto">
                    <LanguageSelect />
                    <Nav.Link as={Link} to="/" className="text-nowrap">{t('home')}</Nav.Link>
                    <Nav.Link as={Link} to="/login" className="text-nowrap">{t('login')}</Nav.Link>
                    <Nav.Link as={Link} to="/signup" className="text-nowrap">{t('registration')}</Nav.Link>
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
                <Route path="/signup">
                  <SignUp />
                </Route>
                <Route path="*">
                  <NotFound />
                </Route>
              </Switch>
            </Container>
            <ToastContainer />
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
