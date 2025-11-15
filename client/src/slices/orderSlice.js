// client/src/slices/orderSlice.js (UPDATED to include verifyPaymentThunk)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- 1. Async Thunk for Creating a New Order (Existing) ---
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (order, { getState, rejectWithValue }) => {
        try {
            const { userInfo } = getState().auth;

            if (!userInfo || !userInfo.token) {
                return rejectWithValue('User not logged in or token missing.');
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // POST request to your backend's order creation endpoint
            const { data } = await axios.post(`/api/orders`, order, config);
            
            return data; // Returns the newly created order object
            
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return rejectWithValue(message);
        }
    }
);

// --- 2. Async Thunk for Getting Order Details (Existing) ---
export const getOrderDetails = createAsyncThunk(
    'order/getOrderDetails',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { userInfo } = getState().auth;

            if (!userInfo || !userInfo.token) {
                return rejectWithValue('User not logged in or token missing.');
            }
            
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // GET request to fetch a specific order
            const { data } = await axios.get(`/api/orders/${id}`, config);
            
            return data;
            
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return rejectWithValue(message);
        }
    }
);

// --- 3. Async Thunk for Payment Verification (NEW) ---
export const verifyPaymentThunk = createAsyncThunk(
    'order/verifyPayment',
    async (paymentData, { getState, rejectWithValue }) => {
        try {
            const { userInfo } = getState().auth;

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // POST request to your backend's verification endpoint
            const { data } = await axios.post(`/api/payment/verify`, paymentData, config);
            
            return data.order; // Return the updated order object
            
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            return rejectWithValue(message);
        }
    }
);


// --- Initial State (UPDATED to include payment status) ---
const initialState = {
    order: null,
    isLoading: false,
    error: null,
    success: false, 
    isOrderLoading: false, 
    orderError: null, 
    isVerifying: false,       // NEW: state for verification loading
    verificationError: null,  // NEW: state for verification error
};

// --- Order Slice (Updated extraReducers) ---
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.order = null;
            state.isLoading = false;
            state.error = null;
            state.success = false;
            state.isOrderLoading = false;
            state.orderError = null;
            state.isVerifying = false;
            state.verificationError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Cases for createOrder (existing)
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.order = action.payload; 
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; 
                state.success = false;
            })

            // Cases for getOrderDetails (existing)
            .addCase(getOrderDetails.pending, (state) => {
                state.isOrderLoading = true;
                state.orderError = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isOrderLoading = false;
                state.order = action.payload; // Overwrite the 'order' state with fetched data
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.isOrderLoading = false;
                state.orderError = action.payload;
            })
            
            // Cases for verifyPaymentThunk (NEW)
            .addCase(verifyPaymentThunk.pending, (state) => {
                state.isVerifying = true;
                state.verificationError = null;
            })
            .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
                state.isVerifying = false;
                // Update the main order object in state with the confirmed, paid order
                state.order = action.payload; 
            })
            .addCase(verifyPaymentThunk.rejected, (state, action) => {
                state.isVerifying = false;
                state.verificationError = action.payload; 
            });
    },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;