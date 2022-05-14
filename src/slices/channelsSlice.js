import { createSlice } from '@reduxjs/toolkit';

const channelSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {
    add: (state, action) => {
      console.log(action.payload)
      state.push(...action.payload);
    },
    remove: () => {},
  }
})
export const { actions } = channelSlice;
export default channelSlice.reducer;