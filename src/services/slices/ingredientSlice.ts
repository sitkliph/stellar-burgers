import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TIngredientState } from '@slices/types.ts';

const initialState: TIngredientState = {
  ingredients: [],
  loading: false,
  error: null,
};

export const getIngredients = createAsyncThunk('ingredients/getAll', async () => {
  return getIngredientsApi();
});

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  },
});

export const { getIngredientsSelector } = ingredientSlice.selectors;
