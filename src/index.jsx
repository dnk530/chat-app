// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './slices/index.js';
import runInit from './init.js';
import socket from './utils/socket.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

runInit(socket, store);

const mountNode = document.getElementById('chat');
const root = ReactDOM.createRoot(mountNode);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

export default socket;
