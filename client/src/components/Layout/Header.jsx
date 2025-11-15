// client/src/components/Layout/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/authSlice';
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaSignInAlt, FaBox } from 'react-icons/fa';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get user info from the auth state
    const { userInfo } = useSelector((state) => state.auth); 
    
    // --- Get Cart and Wishlist State ---
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist); 

    // Calculate total quantity for the cart badge
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0); 
    
    // Calculate total items for the wishlist badge
    const wishlistCount = wishlistItems.length;

    const logoutHandler = () => {
        dispatch(logout()); // Dispatch the synchronous logout action
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 text-white shadow-md sticky top-0 z-10">
            <div className="container-full flex justify-between items-center py-4">
                {/* 1. Logo/Home Link */}
                <Link to="/" className="text-2xl font-bold tracking-wider hover:text-indigo-400 transition duration-150">
                    MERN Shop
                </Link>

                {/* 2. Navigation & Actions */}
                <nav className="flex items-center space-x-6">
                    {/* Cart Link (UPDATED) */}
                    <Link to="/cart" className="relative hover:text-indigo-400 transition duration-150 flex items-center">
                        <FaShoppingCart className="mr-1 text-xl" />
                        Cart
                        {cartCount > 0 && (
                             <span className="absolute -top-2 -right-3 bg-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount} {/* Displays the dynamic count */}
                            </span>
                        )}
                    </Link>

                    {/* Wishlist Link (UPDATED) */}
                    <Link to="/wishlist" className="relative hover:text-indigo-400 transition duration-150 flex items-center">
                        <FaHeart className="mr-1 text-xl" />
                        Wishlist
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-pink-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistCount} {/* Displays the dynamic count */}
                            </span>
                        )}
                    </Link>
                    
                    {/* Dynamic User Links */}
                    {userInfo ? (
                        <div className="group relative"> 
                            
                            {/* The link itself acts as the trigger */}
                            <Link 
                                to="/profile" 
                                className="flex items-center hover:text-indigo-400 transition duration-150 py-2 px-2"
                            >
                                <FaUser className="mr-1 text-xl" />
                                {userInfo.name.split(' ')[0]}
                            </Link>
                            
                            {/* The Dropdown Menu */}
                            <div className="absolute right-0 mt-0 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 transform scale-95 group-hover:scale-100 z-20">
                                <Link 
                                    to="/profile" 
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 border-b"
                                >
                                    <FaUser className="mr-2" /> Profile
                                </Link>
                                <Link 
                                    to="/orders" 
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 border-b"
                                >
                                    <FaBox className="mr-2" /> Orders
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-md"
                                >
                                    <FaSignOutAlt className="mr-2" /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Login Link
                        <Link to="/login" className="flex items-center hover:text-indigo-400 transition duration-150">
                            <FaSignInAlt className="mr-1 text-xl" />
                            Sign In
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;