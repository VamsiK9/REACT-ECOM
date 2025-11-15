// server/routes/userRoutes.js (Update this file)

const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    authUser, 
    getUserProfile, 
    addToWishlist,         // <-- NEW IMPORT
    removeFromWishlist     // <-- NEW IMPORT
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); 

// Register route
router.route('/').post(registerUser); 

// Login route
router.post('/login', authUser);

// Profile route
router.route('/profile').get(protect, getUserProfile); 

// Wishlist Routes (PROTECTED)
router.route('/wishlist')
    .post(protect, addToWishlist); // POST to add a product

router.route('/wishlist/:id')
    .delete(protect, removeFromWishlist); // DELETE to remove a product (ID is the product ID)


module.exports = router;