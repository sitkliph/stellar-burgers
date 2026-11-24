import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  type TRegisterData,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TUserState } from '@slices/types';

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  errors: {
    loginError: null,
    registerError: null,
    updateError: null,
  },
  requests: {
    loginRequest: false,
    registerRequest: false,
    updateRequest: false,
  },
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, password, name }: TRegisterData) => {
    const data = await registerUserApi({ email, password, name });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const getUser = createAsyncThunk('users/getUser', async () => {
  return getUserApi();
});

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user: Partial<TRegisterData>) => {
    return updateUserApi(user);
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
    },
  },
  selectors: {
    loginSelector: (state) => ({
      loginError: state.errors.loginError,
      loginRequest: state.requests.loginRequest,
    }),
    registerSelector: (state) => ({
      registerError: state.errors.registerError,
      registerRequest: state.requests.registerRequest,
    }),
    updateSelector: (state) => ({
      updateError: state.errors.updateError,
      updateRequest: state.requests.updateRequest,
    }),
    userDataSelector: (state) => state.data,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    isAuthenticatedSelector: (state) => state.isAuthenticated,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.requests.loginRequest = true;
        state.errors.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.requests.loginRequest = false;
        state.errors.loginError = action.error;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.requests.loginRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.requests.registerRequest = true;
        state.errors.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.requests.registerRequest = false;
        state.errors.registerError = action.error;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.requests.registerRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.requests.updateRequest = true;
        state.errors.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.requests.updateRequest = false;
        state.errors.updateError = action.error;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.requests.updateRequest = false;
      });
  },
});

const { authChecked, userLogout } = userSlice.actions;
export const {
  userDataSelector,
  isAuthCheckedSelector,
  isAuthenticatedSelector,
  loginSelector,
  registerSelector,
  updateSelector,
} = userSlice.selectors;

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', (_, { dispatch }) => {
  logoutApi()
    .then(() => {
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    })
    .catch(() => {
      console.log('Ошибка выполнения выхода');
    });
});
