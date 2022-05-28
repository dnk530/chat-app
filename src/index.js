// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import ReactDOM from 'react-dom/client';
import runInit from './init.jsx';
import socket from './utils/socket.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const mountNode = document.getElementById('chat');
const root = ReactDOM.createRoot(mountNode);
runInit(socket).then((vdom) => root.render(vdom));

