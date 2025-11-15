// server/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users'); // We'll define dummy users shortly
const products = require('./data/products');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel'); // Assuming you will create this model later
const connectDB = require('./config/db');

// Load environment variables (ensure this path is correct based on where you run the script)
dotenv.config({ path: '../.env' }); 

connectDB();

const importData = async () => {
    try {
        // Clear all collections first
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // 1. Insert Users
        const createdUsers = await User.insertMany(users);
        
        // Find the Admin user (first user in the users array) to link products
        const adminUser = createdUsers[0]._id; 

        // 2. Map Products to the Admin User (Host)
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser };
        });

        // 3. Insert Products
        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error with data destruction: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}