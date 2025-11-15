// client/src/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// --- Helper Function: Update Cart Totals and Persist ---
const updateCart = (state) => {
    // Calculate items price (without shipping/tax)
    state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Calculate shipping price (e.g., free shipping over $100, otherwise $10)
    state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;

    // Calculate total price (simplified: itemsPrice + shippingPrice)
    state.totalPrice = state.itemsPrice + state.shippingPrice;

    // Persist to localStorage
    localStorage.setItem('cart', JSON.stringify(state));
    return state;
};

// --- Initial state, ensuring all properties exist ---
const cartFromLocalStorage = localStorage.getItem('cart') 
    ? JSON.parse(localStorage.getItem('cart')) 
    : {};

const initialState = { 
    // Ensure arrays and objects are initialized correctly if localStorage is empty
    cartItems: cartFromLocalStorage.cartItems || [], 
    shippingAddress: cartFromLocalStorage.shippingAddress || {},
    paymentMethod: cartFromLocalStorage.paymentMethod || 'PayPal', 
    itemsPrice: cartFromLocalStorage.itemsPrice || 0, 
    shippingPrice: cartFromLocalStorage.shippingPrice || 0, 
    totalPrice: cartFromLocalStorage.totalPrice || 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;

            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                // If item exists, update its quantity
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                // If item is new, add it to the array
                state.cartItems = [...state.cartItems, item];
            }
            
            return updateCart(state);
        },

        removeFromCart: (state, action) => {
            const id = action.payload; // Product ID to remove

            state.cartItems = state.cartItems.filter((x) => x.product !== id);
            
            return updateCart(state);
        },
        
        // Reducer to clear cart, useful after successful payment
        clearCart: (state) => {
            state.cartItems = [];
            return updateCart(state);
        },
        
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state); // Persist the updated state
        },
        
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        
        // New reducer to handle clearing the entire cart state after an order is successfully placed (optional but good practice)
        resetCart: (state) => {
            state.cartItems = [];
            state.shippingAddress = {};
            state.paymentMethod = 'PayPal';
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.totalPrice = 0;
            localStorage.removeItem('cart');
            // Note: We don't call updateCart here as we want to completely zero out state
        }
    },
});

export const { addToCart, removeFromCart, clearCart, saveShippingAddress, savePaymentMethod, resetCart } = cartSlice.actions;
export default cartSlice.reducer;