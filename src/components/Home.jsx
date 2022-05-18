import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row, Col, Container, Nav,
} from 'react-bootstrap';

import { actions as channelActions, fetchAllChannels, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions, fetchAllMessages, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import useAuth from '../hooks/index.js';
import NewMessageForm from './NewMessageForm.jsx';
import Messages from './Messages.jsx';
import ChannelButton from './ChannelButton.jsx';

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
  const numberOfMessages = useSelector(messagesSelectors.selectAll)
    .filter((m) => m.channelId === currentChannelId)
    .length;

  const channelName = channels.length > 0
    ? channels.find((c) => (c.id === currentChannelId)).name
    : null;

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100">
        <Col className="col-4 bg-light pt-5 px-0 border-end overflow-hidden">
          <span className="px-3">Channels:</span>
          <Nav
            fill
            variant="pills"
            className="d-flex flex-column px-2"
          >
            {channels.map((channel) => (
              <ChannelButton
                channel={channel}
                isActive={channel.id === currentChannelId}
                onClick={() => dispatch(channelActions.setCurrentChannelId(channel.id))}
              />
            ))}
          </Nav>
        </Col>
        <Col className="h-100">
          <Container fluid className="h-100 p-0 d-flex flex-column">
            <Row className="mb-3 p-2 bg-light shadow-sm small">
              <Col>
                <span>{`#${channelName}`}</span>
                <br />
                <span className="text-muted">
                  {numberOfMessages}
                  &nbsp;messages
                </span>
              </Col>
              <Col className="text-end">
                Welcome,&nbsp;
                {auth.username}
                !
              </Col>
            </Row>
            <Row className="bg-white px-2 overflow-auto">
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
