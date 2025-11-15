// client/src/slices/wishlistSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to get the user's token from Redux state
const getToken = (getState) => {
    const { userInfo } = getState().auth;
    return userInfo ? userInfo.token : null;
};

// --- Async Thunk: Fetch Wishlist from Server (used on login/profile load) ---
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('Not authorized, no token.');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // API call to fetch user profile, which includes the populated wishlist array
            const { data } = await axios.get('/api/users/profile', config);
            
            // The wishlist array is nested within the profile response
            return data.wishlist || []; 

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// --- Async Thunk: Add Product to Wishlist ---
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('Please log in to add items to your wishlist.');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post('/api/users/wishlist', { productId }, config);

            // The backend returns the updated populated wishlist
            return data.wishlist; 
            
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// --- Async Thunk: Remove Product from Wishlist ---
export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId, { getState, rejectWithValue }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('Please log in to modify your wishlist.');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // Backend endpoint uses DELETE method with product ID in the URL
            const { data } = await axios.delete(`/api/users/wishlist/${productId}`, config);
            
            // The backend returns the updated populated wishlist
            return data.wishlist;

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);


// --- Initial State ---
const wishlistInitialState = {
    wishlistItems: [],
    isLoading: false,
    error: null,
};

// --- Wishlist Slice ---
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: wishlistInitialState,
    reducers: {
        // Reducer to clear wishlist state on user logout
        clearWishlist: (state) => {
            state.wishlistItems = [];
        },
    },
    extraReducers: (builder) => {
        // Handle Pending, Fulfilled, and Rejected for all three thunks
        [fetchWishlist, addToWishlist, removeFromWishlist].forEach(thunk => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.isLoading = true;
                    state.error = null;
                })
                .addCase(thunk.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.wishlistItems = action.payload;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                });
        });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;