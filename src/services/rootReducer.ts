import { combineSlices } from '@reduxjs/toolkit';
import { constructorSlice, feedSlice, ingredientSlice, orderSlice } from '@slices';
import { userSlice } from '@slices/userSlice.ts';

export const rootReducer = combineSlices(
  ingredientSlice,
  feedSlice,
  orderSlice,
  userSlice,
  constructorSlice
);
