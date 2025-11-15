// client/src/components/Layout/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <p className="text-sm">© {new Date().getFullYear()} MERN E-commerce Project</p>
    </footer>
  );
};

export default Footer;