// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import { render } from 'react-dom';
import runInit from './init.jsx';
import socket from './utils/socket.js';

const mountNode = document.getElementById('chat');
runInit(socket).then((vdom) => render(vdom, mountNode));
