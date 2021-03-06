import React from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { setLocale } from 'yup';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import App from './components/App.jsx';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import resources from './locales/index.js';
import store from './slices/index.js';
import AuthProvider from './components/providers/AuthProvider.jsx';
import { ApiContext } from './contexts/index.js';

const rollbarConfig = {
  accessToken: process.env.POST_CLIENT_ITEM_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
  },
};

const defaultLanguage = 'ru';

export default async (socket) => {
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      debug: process.env.NODE_ENV === 'development',
      lng: defaultLanguage,
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

    if (currentChannelId === id) {
      store.dispatch(channelsActions.setCurrentChannelId(1));
    }
    store.dispatch(channelsActions.removeChannel(id));
  });

  socket.on('renameChannel', (message) => {
    store.dispatch(channelsActions.renameChannel(message));
  });

  const sendNewMessage = (message, cb) => {
    socket.emit('newMessage', message, cb);
  };

  const addNewChannel = (channel, cb) => {
    socket.emit('newChannel', channel, ({ status, data }) => {
      if (status !== 'ok') {
        cb('Network Error');
        return;
      }
      cb(null, data);
    });
  };

  const renameChannel = (channel, cb) => {
    socket.emit('renameChannel', channel, (res) => {
      if (res.status !== 'ok') {
        cb('Network Error');
        return;
      }
      cb(null);
    });
  };

  const deleteChannel = (channel, cb) => {
    socket.emit('removeChannel', channel, (res) => {
      if (res.status !== 'ok') {
        cb('Network Error');
        return;
      }
      cb(null);
    });
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const apiActions = {
    sendNewMessage,
    addNewChannel,
    renameChannel,
    deleteChannel,
  };

  return (
    <Provider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <I18nextProvider i18n={i18n}>
            <ApiContext.Provider value={apiActions}>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ApiContext.Provider>
          </I18nextProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </Provider>
  );
};
