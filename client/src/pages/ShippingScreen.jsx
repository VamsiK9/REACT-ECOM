// client/src/pages/ShippingScreen.jsx

import React, { useState, useEffect } from 'react'; // <-- IMPORTED useEffect
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/Checkout/CheckoutSteps';
import { FaTruck } from 'react-icons/fa';

const ShippingScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get existing shipping address from Redux state (for pre-filling)
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, cartItems } = cart; // Destructure cartItems here

    // Initialize state with existing data or empty strings
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    
    
    // --- FIX: Move Redirection Logic into useEffect ---
    useEffect(() => {
        if (cartItems.length === 0) {
            // Redirect if the cart is empty
            navigate('/cart');
        }
    }, [cartItems.length, navigate]); 
    // Dependency array ensures this runs if cart items count changes

    const submitHandler = (e) => {
        e.preventDefault();
        
        // Dispatch action to save data to Redux and localStorage
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        
        // Proceed to the next step: Payment Method Selection
        navigate('/payment'); 
    };

    return (
        <div className="flex flex-col items-center py-10">
            {/* Step 1: Checkout Steps Indicator */}
            <CheckoutSteps step1 /> 
            
            <form 
                onSubmit={submitHandler} 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mt-8"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
                    <FaTruck className="mr-2 text-indigo-600" /> Shipping Details
                </h2>

                {/* Address Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Enter full address"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                {/* City Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        placeholder="Enter city"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>

                {/* Postal Code Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">Postal Code</label>
                    <input
                        type="text"
                        id="postalCode"
                        placeholder="Enter postal code"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </div>

                {/* Country Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        placeholder="Enter country"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>

                {/* Continue Button */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                >
                    Continue to Payment
                </button>
            </form>
        </div>
    );
};

export default ShippingScreen;