// client/src/components/Products/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Redux Hooks
import { FaShoppingCart, FaHeart, FaEye, FaTrashAlt } from 'react-icons/fa';

// Import Cart Actions
import { addToCart, removeFromCart } from '../../slices/cartSlice'; 

// Import Wishlist Actions (Async Thunks)
import { addToWishlist, removeFromWishlist } from '../../slices/wishlistSlice'; 

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    
    // Get state from Redux store
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    // --- Dynamic State Checks ---
    // Check if product is in the cart
    const isInCart = cartItems.find((item) => item.product === product._id);
    
    // Check if product is in the wishlist (Wishlist items are full product objects)
    const isInWishlist = wishlistItems.find((item) => item._id === product._id);
    
    // --- Handlers ---
    
    // 1. Cart Action Handler
    const handleCartAction = () => {
        if (product.countInStock === 0) return;

        if (isInCart) {
            // Remove from Cart
            dispatch(removeFromCart(product._id));
        } else {
            // Add to Cart (Payload structure matches cartSlice expectations)
            dispatch(addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty: 1, // Default quantity when adding from product card
            }));
        }
    };

    // 2. Wishlist Action Handler
    const handleWishlistAction = () => {
        if (!userInfo) {
            alert('Please sign in to manage your wishlist.');
            return;
        }

        if (isInWishlist) {
            // Remove from Wishlist (Dispatch async thunk)
            dispatch(removeFromWishlist(product._id));
        } else {
            // Add to Wishlist (Dispatch async thunk)
            dispatch(addToWishlist(product._id)); 
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image */}
            <Link to={`/product/${product._id}`}>
                {/* Note: Images won't show unless you put them in client/public/images */}
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover object-center"
                />
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Name & Price */}
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>

                {/* Actions */}
                <div className="flex space-x-2 mt-auto">
                    {/* View Button */}
                    <Link 
                        to={`/product/${product._id}`}
                        className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-150"
                    >
                        <FaEye className="inline mr-1" /> View
                    </Link>

                    {/* Wishlist Button (Dynamic) */}
                    <button
                        onClick={handleWishlistAction}
                        className={`flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-md transition duration-150 ${
                            isInWishlist ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                        disabled={!userInfo} // Disable if not logged in
                    >
                        {isInWishlist ? (
                             <><FaTrashAlt className="inline mr-1" /> Remove</>
                        ) : (
                            <><FaHeart className="inline mr-1" /> Wishlist</>
                        )}
                    </button>
                </div>
                
                {/* Cart Button (Dynamic & Stock Check) */}
                <button
                    onClick={handleCartAction}
                    className={`mt-2 w-full py-2 text-sm font-medium text-white rounded-md transition duration-150 ${
                        product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : (isInCart ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700')
                    }`}
                    disabled={product.countInStock === 0}
                >
                    {product.countInStock === 0 ? (
                        'Out of Stock'
                    ) : isInCart ? (
                        <><FaTrashAlt className="inline mr-1" /> Remove from Cart</>
                    ) : (
                        <><FaShoppingCart className="inline mr-1" /> Add to Cart</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;