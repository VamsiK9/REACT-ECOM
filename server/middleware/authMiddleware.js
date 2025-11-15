// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the request has an authorization header starting with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (it's formatted as "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token and get user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID and attach it to the request object (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the next middleware or controller function
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };