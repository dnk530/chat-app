import { initReactI18next } from 'react-i18next';
import { setLocale } from 'yup';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import resources from './locales/index.js';
import i18n from './utils/i18n.js';
import socket from './utils/socket.js';
import store from './slices/index.js';

export default async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      debug: process.env.NODE_ENV === 'development',
      lng: 'ru',
    });

  setLocale({
    mixed: {
      required: 'errors.required',
    },
  });

  socket.on('newMessage', (message) => {
    store.dispatch(messagesActions.addMessage(message));
  });

  socket.on('newChannel', (message) => {
    store.dispatch(channelsActions.addChannel(message));
  });

  socket.on('removeChannel', (message) => {
    const { id } = message;
    const { currentChannelId } = store.getState().channels;

    store.dispatch(channelsActions.removeChannel(id));
    if (currentChannelId === id) {
      store.dispatch(channelsActions.setCurrentChannelId(1));
    }
  });

  socket.on('renameChannel', (message) => {
    store.dispatch(channelsActions.renameChannel(message));
  });
};
