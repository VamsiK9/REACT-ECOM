// server/data/products.js

const products = [
    {
        name: 'The Essential React Hoodie',
        image: '/images/hoodie.jpg',
        description:
            'A comfy hoodie perfect for late-night coding sessions. Features the React logo.',
        price: 49.99,
        countInStock: 10,
    },
    {
        name: 'Node.js Developer Mug',
        image: '/images/mug.jpg',
        description:
            'A high-quality ceramic mug for your daily dose of coffee or tea.',
        price: 15.50,
        countInStock: 0, // Example of item out of stock
    },
    {
        name: 'Tailwind CSS Quick Reference Poster',
        image: '/images/poster.jpg',
        description:
            'A large, high-resolution poster with essential Tailwind CSS class references.',
        price: 24.99,
        countInStock: 5,
    },
    {
        name: 'MERN Stack T-Shirt',
        image: '/images/tshirt.jpg',
        description:
            'Show off your full-stack skills with this stylish MERN stack t-shirt.',
        price: 29.99,
        countInStock: 8,
    },
];

module.exports = products;