// server/data/users.js

// NOTE: Passwords are not hashed here; Mongoose will hash them 
// when the user documents are created via User.insertMany().
const users = [
    {
        name: 'Admin Host User',
        email: 'admin@example.com',
        password: '123456', // Mongoose will hash this
        role: 'admin',      // This user will be the product owner
    },
    {
        name: 'Basic Test User',
        email: 'user@example.com',
        password: '123456', // Mongoose will hash this
        role: 'user',       // A regular shopping user
    },
];

module.exports = users;