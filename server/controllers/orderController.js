// server/controllers/orderController.js (CLEANED)

const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel'); // Needed for stock updates
// REMOVED: const { instance } = require('../server'); // Not needed here anymore

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Requires JWT)
const addOrderItems = asyncHandler(async (req, res) => {
    // ... (logic remains unchanged) ...
    const { 
        orderItems, 
        shippingAddress, 
        itemsPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            user: req.user._id, // User ID comes from the 'protect' middleware
            orderItems,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            totalPrice,
            // Payment will be marked as paid after the Razorpay success callback
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Requires JWT)
const getMyOrders = asyncHandler(async (req, res) => {
    // ... (logic remains unchanged) ...
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    if (orders) {
        res.json(orders);
    } else {
        res.status(404);
        throw new Error('No orders found for this user');
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Requires JWT)
const getOrderById = asyncHandler(async (req, res) => {
    // ... (logic remains unchanged) ...
    const order = await Order.findById(req.params.id).populate(
        'user', 
        'name email'
    );

    if (order) {
        // Ensure the order belongs to the logged-in user OR the user is an admin
        if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// REMOVED: createRazorpayOrder function 

module.exports = { 
    addOrderItems, 
    getMyOrders,
    getOrderById,
    // REMOVED: createRazorpayOrder 
};