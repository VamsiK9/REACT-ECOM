// server/models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Added for user permissions and visibility (e.g., "Host" for bookable items)
    role: { 
        type: String,
        enum: ['user', 'host', 'admin'],
        default: 'user',
    },
    // Array of references to the Product Model for the user's wishlist
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Middleware to encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;