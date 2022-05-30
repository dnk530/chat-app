import React from 'react';

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

import { useAuth } from '../hooks/index.js';
import SignUp from './SignUp.jsx';
import LanguageSelect from './LanguageSelect.jsx';

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
  );
}

export default App;
