/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { isOpened: false, type: null, channel: {} },
  reducers: {
    openModal: (state, { payload }) => {
      const { type, channel = {} } = payload;
      state.isOpened = true;
      state.type = type;
      state.channel = channel;
    },
    closeModal: (state) => {
      state.isOpened = false;
      state.type = null;
      state.channel = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
