// client/src/pages/ProductScreen.jsx (UPDATE this file)

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { FaShoppingCart, FaSpinner, FaStar, FaChevronLeft } from 'react-icons/fa';

const ProductScreen = () => {
    const [qty, setQty] = useState(1); // Local state for quantity selection
    const { id } = useParams(); // Get product ID from URL params
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Select state for the single product details
    const { product, isLoading, error } = useSelector((state) => state.productList);
    
    // Select cart state to check if the item is already there
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        // Fetch product details when the component mounts or ID changes
        if (id) {
            dispatch(fetchProductDetails(id));
        }
        
        // Cleanup function to clear state when component unmounts
        return () => {
            dispatch(clearProductDetails());
        };
    }, [dispatch, id]);


    // Handler to add the item to the cart and redirect to the cart screen
    const addToCartHandler = () => {
        if (!product || product.countInStock === 0) return;

        // Dispatch the cart action with the selected quantity
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty: Number(qty), // Ensure quantity is a number
        }));

        // Redirect to the cart screen
        navigate('/cart');
    };
    
    // Check if the item is already in the cart to set the default quantity
    useEffect(() => {
        if (product) {
            const existingCartItem = cartItems.find((item) => item.product === product._id);
            if (existingCartItem) {
                setQty(existingCartItem.qty);
            }
        }
    }, [product, cartItems]);


    if (isLoading || !product) {
        return (
            <div className="flex justify-center py-20">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                <p className="ml-3 text-lg text-gray-600">{isLoading ? 'Loading product...' : 'Product not found.'}</p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center">
                Error: {error}
            </div>
        );
    }
    
    // Helper array for quantity options (up to max stock)
    const qtyOptions = [...Array(product.countInStock).keys()].map(x => x + 1);

    return (
        <div className="py-8">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center mb-6">
                <FaChevronLeft className="mr-1" /> Go Back
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 1. Image Column */}
                <div className="lg:col-span-1">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg shadow-xl"
                    />
                </div>

                {/* 2. Details Column */}
                <div className="lg:col-span-1 space-y-4 border-r border-gray-200 pr-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
                    
                    <div className="flex items-center text-yellow-500">
                        {/* Placeholder for Rating (Can be replaced with a component later) */}
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-400"/>
                        <span className="ml-2 text-gray-600 text-sm">(4.0 stars - 12 reviews)</span>
                    </div>

                    <p className="text-3xl font-bold text-indigo-600 border-t border-b border-gray-200 py-3">
                        Price: ${product.price.toFixed(2)}
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6">Description:</h2>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* 3. Action / Checkout Column */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-2xl h-fit">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <span className="text-lg font-medium">Price:</span>
                        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b">
                        <span className="text-lg font-medium">Status:</span>
                        <span className={`text-lg font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    
                    {/* Quantity Selector */}
                    {product.countInStock > 0 && (
                        <div className="flex justify-between items-center py-4 border-b">
                            <span className="text-lg font-medium">Qty:</span>
                            <select 
                                value={qty} 
                                onChange={(e) => setQty(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {qtyOptions.map((x) => (
                                    <option key={x} value={x}>
                                        {x}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                        onClick={addToCartHandler}
                        className="mt-6 w-full flex items-center justify-center py-3 bg-indigo-600 text-white text-xl font-bold rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={product.countInStock === 0}
                    >
                        <FaShoppingCart className="mr-2" /> 
                        {cartItems.find(item => item.product === product._id) ? 'Update Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;