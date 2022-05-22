import { createSlice, createEntityAdapter, createAsyncThunk, current } from '@reduxjs/toolkit';
import getData from '../utils/fetcher.js';
import { actions as channelsActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

export const fetchAllMessages = createAsyncThunk(
  'messages/fetchAll',
  async () => {
    const data = await getData();
    return data.messages;
  },
);

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
      .addCase(fetchAllMessages.fulfilled, messagesAdapter.addMany)
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
