import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: nanoid() } };
      },
      reducer(state, { payload }: PayloadAction<TConstructorIngredient>) {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
    },
    moveIngredient: (
      state,
      { payload }: PayloadAction<{ id: string; offset: -1 | 1 }>
    ) => {
      const { ingredients } = state;
      const fromIndex = ingredients.findIndex((item) => item.id === payload.id);
      const toIndex = fromIndex + payload.offset;

      if (fromIndex === -1 || toIndex < 0 || toIndex >= ingredients.length) {
        return;
      }

      [ingredients[fromIndex], ingredients[toIndex]] = [
        ingredients[toIndex],
        ingredients[fromIndex],
      ];
    },
    removeIngredient: (state, { payload: id }: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== id);
    },
    cleanConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  selectors: {
    getConstructor: (state) => state,
  },
});

export const { addIngredient, moveIngredient, removeIngredient, cleanConstructor } =
  constructorSlice.actions;

export const { getConstructor } = constructorSlice.selectors;
