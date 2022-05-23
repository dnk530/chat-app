import i18next from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import resources from './locales/index.js';

export default async (socket, store) => {
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
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
