/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Row, Col, Container, Nav, Button, Placeholder,
} from 'react-bootstrap';

import { toast } from 'react-toastify';
import { actions as channelActions, fetchInitialData, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { openModal, closeModal } from '../slices/modalSlice.js';
import { useAuth } from '../hooks/index.js';
import NewMessageForm from './NewMessageForm.jsx';
import Messages from './Messages.jsx';
import ChannelButton from './ChannelButton.jsx';
import AddChannel from './modals/AddChannel.jsx';
import DeleteChannel from './modals/DeleteChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';

const typeToModal = {
  addChannel: AddChannel,
  renameChannel: RenameChannel,
  deleteChannel: DeleteChannel,
};

function Home() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const messageBox = useRef(null);

  useEffect(() => {
    if (!auth.user.loggedIn) {
      return null;
    }
    dispatch(fetchInitialData(auth.user.token));
    return undefined;
  }, [auth.user, dispatch]);

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const loadingState = useSelector((state) => state.channels.loading);

  if (loadingState === 'failed') {
    toast.error(t('errors.networkError'));
  }

  const numberOfMessages = useSelector(messagesSelectors.selectAll)
    .filter((m) => m.channelId === currentChannelId)
    .length;

  const channelName = channels.length > 0
    ? channels.find((c) => (c.id === currentChannelId)).name
    : null;

  const { type, isOpened, channel: data } = useSelector((state) => state.modal);
  const hideModal = () => dispatch(closeModal());
  const Modal = typeToModal[type];

  return (
    <>
      {isOpened && <Modal show modalInfo={data} hideModal={hideModal} />}
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white">
          <Col className="col-4 col-md-2  bg-light pt-4 px-0 border-end">
            <Container className="d-flex justify-content-between ps-0 pe-2 mb-2">
              <span className="px-3">
                {t('channels')}
                :
              </span>
              <Button variant="light" className="p-0" onClick={() => dispatch(openModal({ type: 'addChannel' }))}>+</Button>
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
                  <Nav.Item key={channel.id} className="w-100">
                    <ChannelButton
                      channel={channel}
                      isActive={channel.id === currentChannelId}
                      handleSelect={() => dispatch(channelActions.setCurrentChannelId(channel.id))}
                      handleRename={() => dispatch(openModal({ type: 'renameChannel', channel }))}
                      handleDelete={() => dispatch(openModal({ type: 'deleteChannel', channel }))}
                    />
                  </Nav.Item>
                ))}
            </Nav>
          </Col>
          <Col className="h-100">
            <Container fluid className="h-100 p-0 d-flex flex-column">
              <Row className="mb-3 p-2 bg-light shadow-sm small">
                <Col className="text-truncate">
                  <b className="text-nowrap">{`# ${channelName || ''}`}</b>
                  <br />
                  <span className="text-muted">
                    {t('message', { count: numberOfMessages })}
                  </span>
                </Col>
                <Col className="text-end text-nowrap">
                  {t('welcome')}
                  ,&nbsp;
                  {auth.user.username}
                  !
                </Col>
              </Row>
              <Row ref={messageBox} className="bg-white px-2 overflow-auto flex-column-reverse">
                <Row>
                  <Messages channelId={currentChannelId} />
                </Row>
              </Row>
              <Row className="mt-auto px-3 py-3">
                {loadingState === 'loading' ? <NewMessageForm isLoading /> : <NewMessageForm />}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>

  );
}

export default Home;
