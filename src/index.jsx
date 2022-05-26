// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import App from './components/App.jsx';
import store from './slices/index.js';
import runInit from './init.js';
import socket from './utils/socket.js';
import i18n from './utils/i18n.js';

console.log(process.env.POST_CLIENT_ITEM_ACCESS_TOKEN);

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

runInit();

const mountNode = document.getElementById('chat');
const root = ReactDOM.createRoot(mountNode);
root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Provider>,
);

export default socket;
