// client/src/App.jsx (Ensure this code is replacing the default template code)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
// NOTE: Ensure Footer.jsx exists, even if it's just a simple return <div>Footer</div>;
import Footer from './components/Layout/Footer'; 
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen'; 
import LoginScreen from './pages/LoginScreen'; 
import CartScreen from './pages/CartScreen';
import WishlistScreen from './pages/WishlistScreen';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import OrderScreen from './pages/OrderScreen';
// Add other pages as you create them: CartScreen, WishlistScreen, etc.

function App() {
  return (
    <Router>
      <Header />
      <main className="container-full py-3">
        <Routes>
          <Route path="/" element={<HomeScreen />} exact />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/login" element={<LoginScreen />} /> 
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          {/* Add routes for /register, /cart, /wishlist, /orders here */}
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App