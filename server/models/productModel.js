// server/models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Link to the user (Host/Admin) who created the product
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: { // Relevant for e-commerce products
        type: Number,
        required: true,
        default: 0,
    },
    // You can add a field specific to 'bookable' items if needed
    // Example: isBookable: { type: Boolean, default: false } 
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;