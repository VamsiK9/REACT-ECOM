// server/config/razorpayConfig.js

const Razorpay = require('razorpay');

// Initialize Razorpay Instance using environment variables
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

module.exports = instance;