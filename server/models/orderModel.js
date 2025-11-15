// server/models/orderModel.js

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            // Links the order to the user who placed it
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            // Array of products included in the order
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        // Basic shipping/delivery information (can be expanded)
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        // Details about the payment status
        paymentResult: {
            id: { type: String },
            status: { type: String }, // e.g., 'PAID', 'PENDING'
            update_time: { type: String },
            email_address: { type: String },
        },
        // Financial summary
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true, // Tracks when the order was created and updated
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;