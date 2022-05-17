import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container, Nav,
} from 'react-bootstrap';

import getData from '../utils/fetcher.js';
import { actions as channelActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import useAuth from '../hooks/index.js';
import NewMessageForm from './NewMessageForm.jsx';
import Messages from './Messages.jsx';

function Home() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [activeChannelId, setActiveChannelId] = useState(1);

  useEffect(() => {
    if (!auth.loggedIn) {
      return null;
    }
    getData().then((data) => {
      const { channels, currentChannelId, messages } = data;
      dispatch(channelActions.setChannels(channels));
      dispatch(messagesActions.setMessages(messages));
      setActiveChannelId(currentChannelId);
    });
    return undefined;
  }, []);

  const channels = useSelector(channelsSelectors.selectAll);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100">
        <Col className="col-2 bg-light pt-5 px-0 border-end overflow-hidden">
          <span className="px-3">Channels:</span>
          <Nav fill variant="pills" className="d-flex flex-column align-items-start px-2">
            {channels.map((channel) => <Nav.Item key={channel.id}><Nav.Link active={channel.id === activeChannelId} onClick={() => setActiveChannelId(channel.id)}>{`#${channel.name}`}</Nav.Link></Nav.Item>)}
          </Nav>
        </Col>
        <Col>
          <Container fluid className="h-100 p-0 d-flex flex-column">
            <Row className="mb-3 p-2 bg-light shadow-sm small">
              <span>Chat Header</span>
              <span className="text-muted"># of messages</span>
            </Row>
            <Row className="bg-white px-2">
              <Messages channelId={activeChannelId} />
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
