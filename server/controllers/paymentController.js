// server/controllers/paymentController.js (FIXED)

const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Order = require('../models/orderModel'); 
// FIX: Import the instance from the dedicated config file to break circular dependency
const instance = require('../config/razorpayConfig'); 

// @desc    Get Razorpay Key ID
// @route   GET /api/payment/config/razorpay
// @access  Public
const getRazorpayConfig = asyncHandler(async (req, res) => {
    // Expose the public Key ID from environment variables
    res.send({ 
        keyId: process.env.RAZORPAY_KEY_ID 
    });
});


// @desc    Create a new Razorpay order ID
// @route   POST /api/payment/create-order
// @access  Private (Requires JWT)
const createRazorpayOrder = asyncHandler(async (req, res) => {
    // We expect the MongoDB orderId and the final total amount from the frontend
    const { amount, orderId } = req.body; 

    // Optional: Add a check here to verify the amount matches the MongoDB order total for security

    const options = {
        amount: Math.round(amount * 100), // RZP amount must be in paise/cents (integer)
        currency: 'INR',
        receipt: orderId, // Use the MongoDB Order ID as the receipt
        payment_capture: 1 // Auto capture
    };

    // FIX: Switched to the Promise-based API (using await) for cleaner error handling
    try {
        const rzOrder = await instance.orders.create(options);
        res.json({ id: rzOrder.id, amount: rzOrder.amount, currency: rzOrder.currency }); // Return RZP Order ID and details
    } catch (err) {
        console.error('Razorpay Order Creation Error:', err);
        // The error will now be caught by asyncHandler
        res.status(500); 
        throw new Error(`Razorpay failed to create order: ${err.message}`);
    }
});


// @desc    Verify payment signature and update order status
// @route   POST /api/payment/verify
// @access  Private (Requires JWT)
const verifyPayment = asyncHandler(async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        orderId // This is the MongoDB Order ID
    } = req.body;

    // 1. Generate the signature string
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    // 2. Compare the generated signature with the one received from Razorpay
    if (digest === razorpay_signature) {
        const order = await Order.findById(orderId);
        
        if (order) {
            // 3. Mark the MongoDB Order as Paid
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: razorpay_payment_id,
                order_id: razorpay_order_id,
                status: 'PAID',
                update_time: new Date().toISOString(),
            };

            const updatedOrder = await order.save();
            // Success response for the frontend
            res.json({ message: 'Payment successful', order: updatedOrder });
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } else {
        res.status(400);
        throw new Error('Payment verification failed: Invalid signature');
    }
});

module.exports = { createRazorpayOrder, verifyPayment, getRazorpayConfig };