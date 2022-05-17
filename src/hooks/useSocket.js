import { useContext } from 'react';
import SocketContext from '../contexts/socket.js';

const useSocket = () => useContext(SocketContext);

export default useSocket;
