// client/src/components/Checkout/CheckoutSteps.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// Props: step1, step2, step3, step4 (boolean flags to indicate current step)
const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    
    // Helper function to render a single step link
    const StepLink = ({ isDone, isActive, to, label }) => (
        <div className={`flex-1 text-center border-b-4 pb-2 transition-all duration-300 ${isActive ? 'border-indigo-600 font-bold text-indigo-600' : isDone ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-500'}`}>
            {isDone || isActive ? (
                <Link to={to} className="hover:text-indigo-800">
                    {label}
                </Link>
            ) : (
                <span className="cursor-default">{label}</span>
            )}
        </div>
    );

    return (
        <div className="flex justify-center w-full max-w-xl mx-auto mb-8">
            <StepLink isDone={step1} isActive={step1} to='/shipping' label="1. Shipping" />
            <StepLink isDone={step2} isActive={step2} to='/payment' label="2. Payment" />
            <StepLink isDone={step3} isActive={step3} to='/placeorder' label="3. Place Order" />
            <StepLink isDone={step4} isActive={step4} to='/orders' label="4. Review" />
        </div>
    );
};

export default CheckoutSteps;