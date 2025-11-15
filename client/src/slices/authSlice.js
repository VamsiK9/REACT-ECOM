// client/src/slices/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunk for Login ---
export const loginUser = createAsyncThunk(
  'auth/loginUser', // Action type prefix
  async ({ email, password }, thunkAPI) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      
      // Persist user info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data)); 
      
      return data; // This data becomes the payload for the fulfilled action
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      
      // Use thunkAPI.rejectWithValue to pass the error message to the rejected action
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Initial State ---
const userInfoFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

const initialState = {
  userInfo: userInfoFromStorage,
  isLoading: false,
  error: null,
};

// --- Auth Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous action for logging out
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state during API call
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Success state
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload; // User data from the API
      })
      // Failure state
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Error message from rejectWithValue
        state.userInfo = null;
      });
  },
});

export const { logout } = authSlice.actions; // Export the synchronous logout action
export default authSlice.reducer;