// client/src/pages/WishlistScreen.jsx

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaTrashAlt, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import { fetchWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';

const WishlistScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get state from Redux store
    const { userInfo } = useSelector((state) => state.auth);
    const { wishlistItems, isLoading, error } = useSelector((state) => state.wishlist);

    useEffect(() => {
        // If the user is not logged in, redirect them
        if (!userInfo) {
            navigate('/login?redirect=/wishlist');
        } else {
            // Fetch the wishlist only if logged in and items are empty (or force refresh)
            if (wishlistItems.length === 0) {
                dispatch(fetchWishlist());
            }
        }
    }, [dispatch, navigate, userInfo, wishlistItems.length]); // Dependency on length ensures fetch only if empty initially

    // Handler to remove item from wishlist
    const removeHandler = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    // Handler to move item to cart
    const moveToCartHandler = (item) => {
        // Prepare payload structure matching cartSlice
        dispatch(addToCart({
            product: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            countInStock: item.countInStock,
            qty: 1, // Default to 1 when moving from wishlist
        }));
        
        // Optionally remove from wishlist after moving to cart
        dispatch(removeFromWishlist(item._id));
        
        // Navigate to cart for immediate view
        navigate('/cart');
    };

    return (
        <div className="py-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center">
                <FaHeart className="mr-3 text-pink-600" />
                My Wishlist ({wishlistItems.length})
            </h1>

            {isLoading ? (
                <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-pink-600 text-3xl" /></div>
            ) : error ? (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center">{error}</div>
            ) : wishlistItems.length === 0 ? (
                // Empty Wishlist State
                <div className="p-10 text-center bg-white rounded-lg shadow-lg">
                    <p className="text-xl text-gray-600 mb-4">Your wishlist is empty. Start saving items!</p>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        View Products
                    </Link>
                </div>
            ) : (
                // Wishlist Content
                <div className="bg-white p-6 rounded-lg shadow-xl divide-y divide-gray-200">
                    {wishlistItems.map((item) => (
                        <div key={item._id} className="flex items-center py-4">
                            {/* Image */}
                            <div className="w-16 h-16 mr-4 flex-shrink-0">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover rounded" 
                                />
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <Link to={`/product/${item._id}`} className="text-lg font-medium text-gray-800 hover:text-pink-600 transition">
                                    {item.name}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    ${item.price.toFixed(2)} | Status: 
                                    <span className={`font-semibold ml-1 ${item.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex space-x-4 items-center flex-shrink-0">
                                {/* Move to Cart Button */}
                                <button
                                    onClick={() => moveToCartHandler(item)}
                                    disabled={item.countInStock === 0}
                                    className={`py-2 px-3 text-sm font-medium rounded-md transition duration-150 flex items-center ${
                                        item.countInStock > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    }`}
                                >
                                    <FaShoppingCart className="mr-1" /> Move to Cart
                                </button>
                                
                                {/* Remove Button */}
                                <button 
                                    onClick={() => removeHandler(item._id)}
                                    className="text-gray-500 hover:text-red-700 transition p-2 border rounded-full hover:bg-red-50"
                                >
                                    <FaTrashAlt className="text-lg" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistScreen;