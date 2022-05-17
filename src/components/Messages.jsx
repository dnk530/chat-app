import React from 'react';
import { useSelector } from 'react-redux';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';

function Messages({ channelId }) {
  const messages = useSelector(messageSelectors.selectAll)
    .filter((message) => message.channelId === channelId);
  return (
    messages.map(({ username, text, id }) => (
      <div key={id} className="text-break">
        <b>{username}</b>
        :&nbsp;
        {text}
      </div>
    ))
  );
}

export default Messages;
