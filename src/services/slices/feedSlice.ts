import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TFeedState } from '@utils-types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const getFeed = createAsyncThunk('orders/getAll', async () => {
  return getFeedsApi();
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  },
});

export const { getFeedSelector } = feedSlice.selectors;
