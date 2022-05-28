// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import runInit from './init.jsx';
import socket from './utils/socket.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

runInit(socket);
