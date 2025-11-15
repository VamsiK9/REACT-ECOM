// client/src/pages/HomeScreen.jsx (Update this file)

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import ProductCard from '../components/Products/ProductCard'; 
import { FaSpinner } from 'react-icons/fa';

const HomeScreen = () => {
    const dispatch = useDispatch();
    // Select state from the Redux store
    const { products, isLoading, error } = useSelector((state) => state.productList);

    useEffect(() => {
        // Dispatch the async thunk to fetch products when the component mounts
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Latest Products</h1>

            {isLoading ? (
                // Loading State
                <div className="flex justify-center py-20">
                    <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                    <p className="ml-3 text-lg text-gray-600">Loading products...</p>
                </div>
            ) : error ? (
                // Error State
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center">
                    Error fetching products: {error}
                </div>
            ) : (
                // Success: Display Products in a Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeScreen;