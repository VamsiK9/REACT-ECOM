// client/src/slices/productSlice.js (CORRECTED)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Async Thunk for Fetching Products ---
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/products');
      return data; // Array of product objects
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Async Thunk for Fetching SINGLE Product Details ---
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data; 
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Initial State ---
const initialState = {
  products: [],
  product: null,
  isLoading: false,
  error: null,
};

// --- Product Slice ---
const productSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    // FIX: ADD THE SYNCHRONOUS REDUCER FUNCTION HERE
    clearProductDetails: (state) => {
        state.product = null;
        state.isLoading = false;
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Cases for fetchProducts (fetching all products)
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cases for fetchProductDetails (fetching single product)
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.product = null;
      });
  },
});

// FIX: EXPORT SYNCHRONOUS ACTIONS HERE
export const { clearProductDetails } = productSlice.actions; 

export default productSlice.reducer;