import React, { useMemo } from 'react';
import { ApiContext } from '../../contexts/index.js';

export default function ApiProvider({ children, socketInstance }) {
  const sendNewMessage = (message, cb) => {
    socketInstance.emit('newMessage', message, cb);
  };

  const addNewChannel = (channel, cb) => {
    socketInstance.emit('newChannel', channel, ({ status, data }) => {
      if (status !== 'ok') {
        cb('Network Error');
        return;
      }
      cb(null, data);
    });
  };

  const renameChannel = (channel, cb) => {
    socketInstance.emit('renameChannel', channel, (res) => {
      if (res.status !== 'ok') {
        cb('Network Error');
        return;
      }
      cb(null);
    });
  };

  const deleteChannel = (channel, cb) => {
    socketInstance.emit('removeChannel', channel, (res) => {
      if (res.status !== 'ok') {
        cb('Network Error');
        return;
      }
      cb(null);
    });
  };

  const value = {
    sendNewMessage,
    socketInstance,
    addNewChannel,
    renameChannel,
    deleteChannel,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}
