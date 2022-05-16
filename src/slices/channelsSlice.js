import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    setChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
  },
});

export const { actions } = channelSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelSlice.reducer;
