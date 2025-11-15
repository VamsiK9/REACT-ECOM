// client/src/pages/OrderScreen.jsx (UPDATED to use verifyPaymentThunk and include Auth Header for Order Creation)

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Import the new thunk along with getOrderDetails
import { getOrderDetails, verifyPaymentThunk } from '../slices/orderSlice'; 
import axios from 'axios'; 
import { FaSpinner, FaTruck, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaShoppingBag, FaHome } from 'react-icons/fa';

// ----------------------------------------------------------------------
// RAZORPAY BUTTON COMPONENT
// ----------------------------------------------------------------------

const RazorpayButton = ({ order, dispatch, razorpayKeyId, userInfo }) => {
    // Re-use state for payment initiation loading
    const [loadingPayment, setLoadingPayment] = useState(false); 
    // Get the new verification state from Redux
    const { isVerifying } = useSelector((state) => state.order);

    const displayRazorpay = async () => {
        if (!window.Razorpay) {
            alert('Razorpay SDK not loaded. Please wait or check connection.');
            return;
        }

        // --- NEW CONFIG FOR AUTHORIZATION ---
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // CRITICAL FIX: Pass the user token for authorization
                Authorization: `Bearer ${userInfo.token}`, 
            },
        };
        // -----------------------------------

        setLoadingPayment(true);
        try {
            // 1. Call Backend to create the Razorpay Order ID
            // FIX APPLIED: Passing the config object for authentication
            const { data: razorpayOrder } = await axios.post(
                '/api/payment/create-order', 
                { 
                    orderId: order._id, 
                    amount: order.totalPrice // Send the amount
                },
                config // <--- HERE IS THE FIX
            );

            // 2. Define the payment options for the RZP pop-up
            const options = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'ProShop E-Commerce', // Your store name
                description: `Payment for Order ${order._id}`,
                order_id: razorpayOrder.id, // RZP Order ID from backend
                
                // 3. Success Handler: Fired after successful payment
                handler: async (response) => {
                    const paymentDetails = {
                        orderId: order._id, 
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    
                    try {
                        // Dispatch the Redux thunk for verification (already handles auth)
                        await dispatch(verifyPaymentThunk(paymentDetails)).unwrap();
                        alert('Payment Successful! Order Paid.');
                    } catch (error) {
                        alert(`Payment Verification Failed: ${error}`);
                    }
                },
                
                // Pre-fill user details
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                },
                theme: { color: '#4F46E5' }, 
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', (response) => {
                alert(`Payment Failed: ${response.error.description}`);
            });
            paymentObject.open();

        } catch (error) {
            console.error('Payment initiation error:', error);
            alert(`Payment failed: ${error.response?.data?.message || error.message}`);
        } finally {
            // Set loadingPayment to false after the pop-up opens or fails to open
            setLoadingPayment(false);
        }
    };

    const isButtonDisabled = loadingPayment || order.isPaid || isVerifying;

    return (
        <button
            onClick={displayRazorpay}
            className="w-full mt-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-150 flex items-center justify-center disabled:bg-gray-400"
            disabled={isButtonDisabled}
        >
            {loadingPayment || isVerifying ? (
                <FaSpinner className="animate-spin mr-2" />
            ) : (
                `Pay ₹${order.totalPrice.toFixed(2)} with Razorpay` // Assuming INR
            )}
        </button>
    );
};


// ----------------------------------------------------------------------
// ORDER SCREEN COMPONENT
// ----------------------------------------------------------------------

const OrderScreen = () => {
    const { id: orderId } = useParams(); 
    const dispatch = useDispatch();
    
    // Get the new verification error state
    const { order, isOrderLoading, orderError, verificationError } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth); 

    // NEW STATE: To hold the fetched Razorpay Key ID
    const [razorpayKeyId, setRazorpayKeyId] = useState('');

    // --- Fetch Order Details & Razorpay Key on Load ---
    useEffect(() => {
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
        
        // 1. Fetch the Razorpay Key ID
        const fetchConfig = async () => {
            try {
                // Hitting the new consolidated config route
                const { data } = await axios.get('/api/payment/config/razorpay'); 
                setRazorpayKeyId(data.keyId);
            } catch (error) {
                console.error('Failed to fetch Razorpay Key ID:', error);
            }
        };
        fetchConfig();

        // 2. Dynamically load the external Razorpay SDK script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);

        return () => {
            // Cleanup the script on component unmount
            document.body.removeChild(script);
        };
        
    }, [order, orderId, dispatch]);

    // --- Loading and Error States ---
    if (isOrderLoading) {
        return (
            <div className="flex justify-center py-20 text-indigo-600">
                <FaSpinner className="animate-spin text-4xl mr-3" />
                <h2 className="text-2xl font-semibold">Loading Order...</h2>
            </div>
        );
    }

    if (orderError) {
        return (
            <div className="text-center py-20 text-red-600 bg-red-50 rounded-lg shadow-md">
                <FaTimesCircle className="text-4xl mx-auto mb-4" />
                <h2 className="text-2xl font-semibold">Error Loading Order</h2>
                <p className="text-lg mt-2">{orderError}</p>
            </div>
        );
    }
    
    if (!order) {
        return null;
    }

    // --- Render Order Details ---
    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Order ID: {order._id}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* 1. Order Details (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Shipping Details (Unchanged) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 flex items-center">
                            <FaTruck className="mr-2 text-indigo-600" /> Shipping
                        </h2>
                        <p className="text-gray-700 mb-2">
                            **Name:** {order.user.name} ({order.user.email})
                        </p>
                        <p className="text-gray-700">
                            **Address:** {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        <div className={`mt-3 p-2 rounded text-sm font-semibold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
                        </div>
                    </div>

                    {/* Payment Details (Unchanged) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold mb-3 text-gray-800 flex items-center">
                            <FaMoneyBillWave className="mr-2 text-indigo-600" /> Payment Method
                        </h2>
                        <p className="text-gray-700">
                            **Method:** {order.paymentMethod}
                        </p>
                        <div className={`mt-3 p-2 rounded text-sm font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isPaid ? (
                                <span className='flex items-center'><FaCheckCircle className='mr-1' /> Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                            ) : (
                                <span className='flex items-center'><FaTimesCircle className='mr-1' /> Not Paid</span>
                            )}
                        </div>
                        
                        {/* Display verification error if present */}
                        {verificationError && (
                            <div className="mt-3 p-2 bg-red-200 text-red-800 rounded text-sm font-medium">
                                Verification Error: {verificationError}
                            </div>
                        )}
                    </div>

                    {/* Order Items (Unchanged) */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                            <FaShoppingBag className="mr-2 text-indigo-600"/> Order Items
                        </h2>
                        <div className="divide-y divide-gray-100">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-3">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                        <Link to={`/product/${item.product}`} className="text-indigo-600 hover:text-indigo-800">
                                            {item.name}
                                        </Link>
                                    </div>
                                    <span className="text-gray-600">
                                        {item.qty} x ${item.price.toFixed(2)} = **${(item.qty * item.price).toFixed(2)}**
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Order Summary & Payment (Right Column) */}
                <div className="lg:col-span-1 h-fit">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold mb-5 border-b pb-3 text-gray-800 text-center">Order Summary</h2>

                        <div className="space-y-3 text-gray-700 text-lg">
                            {/* ... (Summary lines unchanged) ... */}
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>${(order.itemsPrice || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>${(order.shippingPrice || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span>Tax:</span>
                                <span>${(order.taxPrice || 0).toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between pt-3 text-2xl font-extrabold text-gray-900">
                                <span>Total:</span>
                                <span>${(order.totalPrice || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Area (Only show if not paid AND key is loaded) */}
                        {!order.isPaid && razorpayKeyId && (
                            <RazorpayButton 
                                order={order} 
                                dispatch={dispatch}
                                razorpayKeyId={razorpayKeyId}
                                userInfo={userInfo}
                            />
                        )}
                        {/* Show a spinner if waiting for the key */}
                        {!order.isPaid && !razorpayKeyId && (
                            <div className="w-full mt-4 py-3 bg-gray-200 text-gray-600 text-center rounded-lg flex items-center justify-center">
                                <FaSpinner className="animate-spin mr-2" /> Loading payment...
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* --- HOME BUTTON --- (Unchanged) */}
            <div className='flex justify-center mt-12'>
                <Link to="/" 
                    className='py-3 px-8 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition duration-150 shadow-lg flex items-center'>
                    <FaHome className='mr-2' /> Return to Home Page
                </Link>
            </div>
        </div>
    );
};

export default OrderScreen;