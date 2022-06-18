/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({ currentChannelId: null, loading: 'idle', error: null });

export const fetchInitialData = createAsyncThunk(
  'channels/fetchAll',
  async (token) => {
    const { data } = await axios.get(routes.allDataPath(), { headers: { Authorization: `Bearer ${token}` } });
    return data;
  },
);

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    renameChannel: channelsAdapter.setOne,
    setChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.error = null;
        const { channels, currentChannelId } = action.payload;
        channelsAdapter.addMany(state, channels);
        if (state.currentChannelId === null) {
          state.currentChannelId = currentChannelId;
        }
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.code;
      });
  },
});

export const { actions } = channelSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelSlice.reducer;
