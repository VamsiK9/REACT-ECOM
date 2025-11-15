// server/server.js (FIXED)

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// const Razorpay = require('razorpay'); // No longer needed here

// --- FIX 1: Load environment variables correctly from the project root (.env) ---
// Since server.js is in 'server/', we reference '../.env'
dotenv.config({ path: '../.env' }); 

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Connect to database (Now MONGO_URI will be defined)
connectDB();

const app = express();

// Middleware to parse JSON body (for POST requests)
app.use(express.json());

// 1. Razorpay Instance Initialization is now in 'server/config/razorpayConfig.js'

// --- ROUTES SECTION ---
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/payment', paymentRoutes); 

// Basic Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`) 
);