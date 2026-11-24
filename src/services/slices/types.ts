import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient, TOrder, TUser } from '@utils-types';

export type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: SerializedError | null;
};

export type TOrderState = {
  orderData: TOrder | null;
  userOrders: TOrder[];
  loading: boolean;
  error: SerializedError | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  errors: {
    loginError: SerializedError | null;
    registerError: SerializedError | null;
    updateError: SerializedError | null;
  };
  requests: {
    loginRequest: boolean;
    registerRequest: boolean;
    updateRequest: boolean;
  };
};
