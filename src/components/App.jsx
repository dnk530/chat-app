import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { Navbar, Nav, Container, Row, Col, Collapse } from 'react-bootstrap'

import Login from './Login.jsx';

export default function App() {
  return (
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
  );
}

const Home = () => (
  <Container>
    <Row>
      <Col>
        <h2>Home</h2>
      </Col>
    </Row>
  </Container>
);
const NotFound = () => <h2>404</h2>;
