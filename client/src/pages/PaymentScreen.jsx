// client/src/pages/PaymentScreen.jsx (Updated for Razorpay)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';
import { FaCreditCard } from 'react-icons/fa';

const PaymentScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get state from Redux
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, paymentMethod } = cart;

    // Local state for selected payment method, defaulting to 'Razorpay'
    // Since we are using Razorpay as the primary gateway, we default to it.
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || 'Razorpay');

    // --- Redirection Logic ---
    useEffect(() => {
        // Ensure shipping address is set before accessing this screen
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);

    const submitHandler = (e) => {
        e.preventDefault();
        
        // Dispatch action to save the selected payment method (should be 'Razorpay')
        dispatch(savePaymentMethod(selectedPaymentMethod));
        
        // Proceed to the final step: Place Order Screen
        navigate('/placeorder'); 
    };

    return (
        <div className="flex flex-col items-center py-10">
            {/* Step 2: Checkout Steps Indicator */}
            <CheckoutSteps step1 step2 step3 /> {/* Step 3 is Payment */}
            
            <form 
                onSubmit={submitHandler} 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mt-8"
            >
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
                    <FaCreditCard className="mr-2 text-indigo-600" /> Select Payment Method
                </h2>

                {/* Payment Options */}
                <div className="mb-6 space-y-4">
                    
                    {/* Razorpay Option (Replaces PayPal/Stripe) */}
                    <div className="flex items-center p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                        <input
                            type="radio"
                            id="Razorpay"
                            name="paymentMethod"
                            value="Razorpay"
                            checked={selectedPaymentMethod === 'Razorpay'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-indigo-600 border-indigo-400 focus:ring-indigo-500"
                            required
                        />
                        <label htmlFor="Razorpay" className="ml-3 block text-lg font-bold text-gray-800">
                            Razorpay (UPI, Card, Netbanking)
                        </label>
                    </div>

                    {/* Optional: Add a "Cash on Delivery" or placeholder if needed */}
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-150">
                         <input
                            type="radio"
                            id="COD"
                            name="paymentMethod"
                            value="Cash on Delivery"
                            checked={selectedPaymentMethod === 'Cash on Delivery'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                            required
                        />
                        <label htmlFor="COD" className="ml-3 block text-lg font-medium text-gray-700">
                            Cash on Delivery (COD)
                        </label>
                    </div>

                </div>

                {/* Continue Button */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                >
                    Continue to Place Order
                </button>
            </form>
        </div>
    );
};

export default PaymentScreen;