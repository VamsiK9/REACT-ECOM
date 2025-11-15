// client/src/pages/CartScreen.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaTrashAlt, FaChevronLeft } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';

// --- Helper Component: CartItem ---
const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    
    // Handler to change quantity
    const qtyChangeHandler = (e) => {
        const qty = Number(e.target.value);
        // Dispatch addToCart, which updates quantity if item exists
        dispatch(addToCart({ ...item, qty }));
    };

    // Handler to remove item
    const removeHandler = () => {
        dispatch(removeFromCart(item.product));
    };

    // Helper array for quantity options
    const qtyOptions = [...Array(item.countInStock).keys()].map(x => x + 1);

    return (
        <div className="flex items-center border-b py-4">
            {/* Image */}
            <div className="w-16 h-16 mr-4 flex-shrink-0">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded" 
                />
            </div>
            
            {/* Name Link */}
            <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product}`} className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition">
                    {item.name}
                </Link>
            </div>
            
            {/* Price */}
            <div className="w-20 text-center font-semibold text-gray-700">
                ${item.price.toFixed(2)}
            </div>

            {/* Quantity Selector */}
            <div className="w-24 px-4">
                <select 
                    value={item.qty} 
                    onChange={qtyChangeHandler}
                    className="border border-gray-300 rounded-md p-1 w-full text-sm"
                >
                    {qtyOptions.map((x) => (
                        <option key={x} value={x}>
                            {x}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subtotal */}
            <div className="w-24 text-right font-bold text-gray-800">
                ${(item.price * item.qty).toFixed(2)}
            </div>

            {/* Remove Button */}
            <div className="w-12 text-right">
                <button 
                    onClick={removeHandler}
                    className="text-red-500 hover:text-red-700 transition"
                >
                    <FaTrashAlt className="text-lg" />
                </button>
            </div>
        </div>
    );
};


// --- Main Component: CartScreen ---
const CartScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { cartItems, itemsPrice, shippingPrice, totalPrice } = cart;

    // Calculate total quantity of items
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    // Handler to proceed to the next step (e.g., Shipping/Login)
    const checkoutHandler = () => {
        // Here we can decide to navigate to /login if not logged in, or /shipping
        navigate('/shipping'); // Assuming /shipping is the next step
    };

    return (
        <div className="py-8">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center mb-6">
                <FaChevronLeft className="mr-1" /> Continue Shopping
            </Link>
            
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center">
                <FaShoppingCart className="mr-3 text-indigo-600" />
                Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                // Empty Cart State
                <div className="p-10 text-center bg-white rounded-lg shadow-lg">
                    <p className="text-xl text-gray-600 mb-4">Your cart is currently empty.</p>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                // Cart Content Grid
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl">
                        {cartItems.map((item) => (
                            <CartItem key={item.product} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-xl h-fit border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-3 text-gray-800">
                            Order Summary
                        </h2>

                        {/* Subtotals */}
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Items ({totalQty}) Price:</span>
                                <span className="font-semibold">${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span>Shipping:</span>
                                <span className="font-semibold text-green-600">
                                    {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                                </span>
                            </div>
                            
                            {/* Total */}
                            <div className="flex justify-between pt-3 text-2xl font-extrabold text-gray-900">
                                <span>Total:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {/* Checkout Button */}
                        <button
                            onClick={checkoutHandler}
                            className="mt-6 w-full py-3 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition duration-150"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;