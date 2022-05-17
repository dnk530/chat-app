import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container, Nav,
} from 'react-bootstrap';

import { actions as channelActions, fetchAllChannels, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions, fetchAllMessages } from '../slices/messagesSlice.js';
import useAuth from '../hooks/index.js';
import NewMessageForm from './NewMessageForm.jsx';
import Messages from './Messages.jsx';

function Home() {
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.loggedIn) {
      return null;
    }
    dispatch(fetchAllChannels());
    dispatch(fetchAllMessages());
    return undefined;
  }, []);

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100">
        <Col className="col-2 bg-light pt-5 px-0 border-end overflow-hidden">
          <span className="px-3">Channels:</span>
          <Nav fill variant="pills" className="d-flex flex-column align-items-start px-2">
            {channels.map((channel) => <Nav.Item key={channel.id}><Nav.Link active={channel.id === currentChannelId} onClick={() => dispatch(channelActions.setCurrentChannelId(channel.id))}>{`#${channel.name}`}</Nav.Link></Nav.Item>)}
          </Nav>
        </Col>
        <Col>
          <Container fluid className="h-100 p-0 d-flex flex-column">
            <Row className="mb-3 p-2 bg-light shadow-sm small">
              <span>Chat Header</span>
              <span className="text-muted"># of messages</span>
            </Row>
            <Row className="bg-white px-2">
              <Messages channelId={currentChannelId} />
            </Row>
            <Row className="mt-auto py-5">
              <NewMessageForm />
            </Row>
          </Container>
        </Col>
      </Row>

    </Container>
  );
}

export default Home;
