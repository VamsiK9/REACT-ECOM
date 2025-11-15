// server/routes/orderRoutes.js (CLEANED)

const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders,
    getOrderById,
    // REMOVED: createRazorpayOrder (It is now in paymentController)
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders to create an order
router.route('/')
    .post(protect, addOrderItems);

// GET /api/orders/myorders to fetch user's orders
router.route('/myorders')
    .get(protect, getMyOrders);

// GET /api/orders/:id to fetch a single order detail
router.route('/:id')
    .get(protect, getOrderById);

// REMOVED DUPLICATION:
// router.route('/:id/razorpay-order').post(protect, createRazorpayOrder); 
// The order creation for RZP is now POST /api/payment/create-order

module.exports = router;