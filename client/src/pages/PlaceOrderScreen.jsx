// client/src/pages/PlaceOrderScreen.jsx (CRITICAL UPDATE)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';
import { createOrder, resetOrderState } from '../slices/orderSlice';
import { resetCart } from '../slices/cartSlice';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaShoppingBag } from 'react-icons/fa';

// Helper function to calculate tax (e.g., 15% tax on items price)
const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get Cart State
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, paymentMethod, cartItems, itemsPrice, shippingPrice } = cart;

    // Get Order State
    const { order, isLoading, error, success } = useSelector((state) => state.order);

    // --- Price Calculation (Finalizing the numbers) ---
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const finalTotalPrice = addDecimals(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice));


    // --- CRITICAL FIX: Redirection and State Cleanup ---
    useEffect(() => {
        // 1. Ensure all checkout steps are completed
        if (!shippingAddress.address) {
            navigate('/shipping');
            return;
        } 
        if (!paymentMethod) {
            navigate('/payment');
            return;
        }
        
        // 2. Redirect on successful order creation
        if (success && order && order._id) {
            
            // Step A: Navigate immediately using replace to the Order Success Page.
            navigate(`/order/${order._id}`, { replace: true });
            
            // Step B: Use a slight delay (e.g., 100ms) to ensure the navigation completes 
            // before clearing the cart state, which prevents the empty cart redirect loop.
            const timeoutId = setTimeout(() => {
                dispatch(resetCart());
                dispatch(resetOrderState());
            }, 100);

            // Cleanup the timeout if the component unmounts quickly
            return () => clearTimeout(timeoutId);
        }
    }, [navigate, shippingAddress, paymentMethod, success, order, dispatch]);


    // --- Order Submission Handler ---
    const placeOrderHandler = () => {
        if (cartItems.length === 0) {
             alert('Cart is empty!');
             navigate('/');
             return;
        }

        // Dispatch the async thunk to create the order
        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            shippingPrice: shippingPrice,
            taxPrice: Number(taxPrice),
            totalPrice: Number(finalTotalPrice),
        }));
    };

    return (
        <div className="py-8">
            {/* Step 3: Checkout Steps Indicator */}
            <CheckoutSteps step1 step2 step3 /> 

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
                
                {/* 1. Order Details (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Shipping</h2>
                        <p className="text-gray-700">
                            **Address:** {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Payment Method</h2>
                        <p className="text-gray-700">
                            **Method:** {paymentMethod}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                            <FaShoppingBag className="mr-2 text-indigo-600"/> Order Items
                        </h2>
                        {cartItems.length === 0 ? (
                            <p className="text-red-500">Your cart is empty.</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-3">
                                        <div className="flex items-center">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                            <span className="text-gray-700">{item.name}</span>
                                        </div>
                                        <span className="text-gray-600">
                                            {item.qty} x ${item.price.toFixed(2)} = **${(item.qty * item.price).toFixed(2)}**
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Order Summary (Right Column) */}
                <div className="lg:col-span-1 h-fit">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold mb-5 border-b pb-3 text-gray-800 text-center">Order Summary</h2>

                        <div className="space-y-3 text-gray-700 text-lg">
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>${shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span>Tax (15%):</span>
                                <span>${taxPrice}</span>
                            </div>
                            
                            <div className="flex justify-between pt-3 text-2xl font-extrabold text-gray-900">
                                <span>Total:</span>
                                <span>${finalTotalPrice}</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center">
                                <FaExclamationTriangle className="mr-2"/> Error: {error}
                            </div>
                        )}
                        
                        {/* Place Order Button */}
                        <button
                            onClick={placeOrderHandler}
                            className="mt-6 w-full py-3 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition duration-150 flex items-center justify-center disabled:bg-gray-400"
                            disabled={cartItems.length === 0 || isLoading}
                        >
                            {isLoading ? (
                                <><FaSpinner className="animate-spin mr-2" /> Placing Order...</>
                            ) : (
                                <><FaCheckCircle className="mr-2" /> Place Order</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;