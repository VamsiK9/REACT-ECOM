// server/routes/paymentRoutes.js (UPDATED)

const express = require('express');
const router = express.Router();
const { 
    createRazorpayOrder, 
    verifyPayment,
    getRazorpayConfig // <-- New controller function for Key ID
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/payment/config/razorpay to fetch the Key ID
router.get('/config/razorpay', getRazorpayConfig); // Doesn't need 'protect'

// POST /api/payment/create-order to create the RZP Order ID
router.post('/create-order', protect, createRazorpayOrder);

// POST /api/payment/verify to verify the payment signature
router.post('/verify', protect, verifyPayment);

module.exports = router;