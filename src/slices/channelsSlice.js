import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import getData from '../utils/fetcher.js';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({ currentChannelId: null });

export const fetchAllChannels = createAsyncThunk(
  'channels/fetchAll',
  async () => {
    const data = await getData();
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
      .addCase(fetchAllChannels.fulfilled, (state, action) => {
        const { channels, currentChannelId } = action.payload;
        channelsAdapter.addMany(state, channels);
        if (state.currentChannelId === null) {
          state.currentChannelId = currentChannelId;
        }
      });
  },
});

export const { actions } = channelSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelSlice.reducer;
