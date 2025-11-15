// client/src/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productListReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice'; 
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    // Add all reducers (slices) here
    auth: authReducer,
    productList: productListReducer,
    cart: cartReducer, 
    wishlist: wishlistReducer,
    order: orderReducer, 
    // cart: cartReducer, // Placeholder for future slices
    // productList: productListReducer,
  },
  // Add middleware, devtools config, etc. here if needed (RTK handles most defaults)
});

export default store;