import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cleanConstructor } from '@slices';

import type { TOrderState } from '@slices/types';

const initialState: TOrderState = {
  orderData: null,
  userOrders: [],
  loading: false,
  error: null,
  orderRequest: false,
  orderModalData: null,
};

export const getOrderData = createAsyncThunk(
  'orders/getByNumber',
  async (number: number) => {
    return getOrderByNumberApi(number);
  }
);

export const getUserOrders = createAsyncThunk('orders/getUserOrders', async () => {
  return getOrdersApi();
});

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[], { dispatch }) => {
    const response = await orderBurgerApi(data);
    dispatch(cleanConstructor());
    return response;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    cleanOrderModalData: (state) => {
      state.orderModalData = null;
    },
  },
  selectors: {
    getOrder: (state) => ({
      orderData: state.orderData,
      loading: state.loading,
      error: state.error,
    }),
    getUserOrdersSelector: (state) => ({
      orders: state.userOrders,
      loading: state.loading,
      error: state.error,
    }),
    orderBurgerSelector: (state) => ({
      orderRequest: state.orderRequest,
      orderModalData: state.orderModalData,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderData = null;
      })
      .addCase(getOrderData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getOrderData.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload.orders[0];
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      });
  },
});

export const { cleanOrderModalData } = orderSlice.actions;

export const { getOrder, getUserOrdersSelector, orderBurgerSelector } =
  orderSlice.selectors;
