// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import runInit from './init.jsx';

const socket = io();

const mountNode = document.getElementById('chat');
runInit(socket).then((vdom) => render(vdom, mountNode));
