// server/controllers/userController.js

const asyncHandler = require('express-async-handler'); // Helper for error handling
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400); // Bad Request
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password, // Password hashing happens in userModel.js pre-save hook
    });

    if (user) {
        res.status(201).json({ // Created
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // matchPassword is the method defined in userModel.js
    if (user && (await user.matchPassword(password))) { 
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires JWT/Middleware)
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by the 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wishlist: user.wishlist, // Include the wishlist for easy access
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// server/controllers/userController.js (Add these two functions)

// @desc    Add product to user's wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id; // User ID from the 'protect' middleware

    const user = await User.findById(userId);

    if (user) {
        // Check if the product is already in the wishlist
        if (user.wishlist.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }

        // Add the product ID to the wishlist array
        user.wishlist.push(productId);
        await user.save();

        // Optionally populate the wishlist to return full product details
        const updatedUser = await User.findById(userId).populate('wishlist', 'name image price').select('-password');
        
        res.status(200).json({ 
            message: 'Product added to wishlist',
            wishlist: updatedUser.wishlist,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove product from user's wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params; // The product ID to remove
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
        // Use the $pull operator to remove the ID from the array in MongoDB
        user.wishlist.pull(id);
        await user.save();
        
        // Optionally populate the wishlist to return full product details
        const updatedUser = await User.findById(userId).populate('wishlist', 'name image price').select('-password');

        res.status(200).json({ 
            message: 'Product removed from wishlist',
            wishlist: updatedUser.wishlist,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Export the new functions
module.exports = { registerUser, authUser, getUserProfile, addToWishlist, removeFromWishlist };
