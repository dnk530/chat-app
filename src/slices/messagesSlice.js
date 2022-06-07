import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions, fetchInitialData } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
    removeMessage: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.addMany(state, messages);
      })
      .addCase(channelsActions.removeChannel, (state, action) => {
        const channelId = action.payload;
        const newMessages = Object.values(state.entities).filter((m) => m.channelId !== channelId);
        messagesAdapter.setAll(state, newMessages);
      });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
