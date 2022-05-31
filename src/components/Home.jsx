import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Row, Col, Container, Nav, Button, Placeholder,
} from 'react-bootstrap';

import { actions as channelActions, fetchAllChannels, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { fetchAllMessages, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { useAuth } from '../hooks/index.js';
import NewMessageForm from './NewMessageForm.jsx';
import Messages from './Messages.jsx';
import ChannelButton from './ChannelButton.jsx';
import AddChannel from './modals/AddChannel.jsx';
import DeleteChannel from './modals/DeleteChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';

function Home() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const messageBox = useRef(null);

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
  const loadingState = useSelector((state) => state.channels.loading);
  const numberOfMessages = useSelector(messagesSelectors.selectAll)
    .filter((m) => m.channelId === currentChannelId)
    .length;

  const channelName = channels.length > 0
    ? channels.find((c) => (c.id === currentChannelId)).name
    : null;

  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });

  useEffect(() => {
    if (messageBox.current.lastChild) {
      messageBox.current.lastChild.scrollIntoView();
    }
  });

  const showModal = (type, channel = null) => () => {
    setModalInfo({ type, channel });
  };
  const hideModal = () => {
    setModalInfo({ type: null, channel: null });
  };

  return (
    <>
      <AddChannel show={modalInfo.type === 'addChannel'} hideModal={hideModal} />
      <DeleteChannel show={modalInfo.type === 'deleteChannel'} hideModal={hideModal} modalInfo={modalInfo} />
      <RenameChannel show={modalInfo.type === 'renameChannel'} hideModal={hideModal} modalInfo={modalInfo} />
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white">
          <Col className="col-4 col-md-2  bg-light pt-4 px-0 border-end">
            <Container className="d-flex justify-content-between ps-0 pe-2 mb-2">
              <span className="px-3">
                {t('channels')}
                :
              </span>
              <Button variant="light" className="p-0" onClick={showModal('addChannel')}>+</Button>
            </Container>
            <Nav
              fill
              variant="pills"
              className="d-flex flex-column px-2"
            >
              {loadingState === 'loading'
                ? (
                  <Placeholder animation="glow">
                    <Placeholder as="p" xs={12} size="lg" bg="secondary" />
                    <Placeholder as="p" xs={8} size="lg" bg="secondary" />
                    <Placeholder as="p" xs={10} size="lg" bg="secondary" />
                  </Placeholder>
                )
                : channels.map((channel) => (
                  <ChannelButton
                    key={channel.id}
                    channel={channel}
                    isActive={channel.id === currentChannelId}
                    handleSelect={() => dispatch(channelActions.setCurrentChannelId(channel.id))}
                    handleRename={showModal('renameChannel', channel)}
                    handleDelete={showModal('deleteChannel', channel)}
                  />
                ))}
            </Nav>
          </Col>
          <Col className="h-100">
            <Container fluid className="h-100 p-0 d-flex flex-column">
              <Row className="mb-3 p-2 bg-light shadow-sm small">
                <Col>
                  <span>{`#${channelName || ''}`}</span>
                  <br />
                  <span className="text-muted">
                    {t('message', { count: numberOfMessages })}
                  </span>
                </Col>
                <Col className="text-end">
                  {t('welcome')}
                  ,&nbsp;
                  {auth.username}
                  !
                </Col>
              </Row>
              <Row ref={messageBox} className="bg-white px-2 overflow-auto">
                <Messages channelId={currentChannelId} />
              </Row>
              <Row className="mt-auto px-3 py-3">
                {loadingState === 'loading' || modalInfo.type !== null ? <NewMessageForm isLoading /> : <NewMessageForm />}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>

  );
}

export default Home;
