// client/src/pages/LoginScreen.jsx (UPDATED for Redux Toolkit)

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // <-- REDUX HOOKS
import { loginUser } from '../slices/authSlice'; // <-- ASYNC THUNK
import { FaSignInAlt } from 'react-icons/fa'; 

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- REDUX HOOKS ---
    const dispatch = useDispatch();
    const { userInfo, isLoading, error } = useSelector((state) => state.auth);

    const redirect = location.search ? location.search.split('=')[1] : '/';
    
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = (e) => { // No longer async here, as the thunk handles it
        e.preventDefault();
        // Dispatch the async thunk, passing the arguments
        dispatch(loginUser({ email, password })); 
    };

    return (
        <div className="flex justify-center items-center py-10">
            <form 
                onSubmit={submitHandler} 
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
                    <FaSignInAlt className="mr-2 text-indigo-600" /> Sign In
                </h2>

                {/* Error is now pulled from the Redux state */}
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>} 

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Register Link */}
                <div className="mt-4 text-center">
                    New Customer?{' '}
                    <Link 
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginScreen;