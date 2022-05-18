import { actions as messagesActions } from './slices/messagesSlice.js';

export default (socket, store) => {
  socket.on('newMessage', (message) => {
    store.dispatch(messagesActions.addMessage(message));
  });
};
