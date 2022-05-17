import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import getData from '../utils/fetcher.js';

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
    builder.addCase(fetchAllMessages.fulfilled, messagesAdapter.addMany);
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
