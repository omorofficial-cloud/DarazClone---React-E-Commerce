import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { StorageService } from './services/storage';
import { Product, CartItem, User, Order } from './types';

// Pages
import Storefront from './pages/Storefront';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/SellerDashboard';
import UserDashboard from './pages/UserDashboard';
import AuthPage from './pages/AuthPage';
import AddProduct from './pages/AddProduct';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Load initial state
  useEffect(() => {
    const savedCart = localStorage.getItem('daraz_clone_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedUser = StorageService.getUser();
    if (savedUser) setUser(savedUser);
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('daraz_clone_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const handleLogin = (newUser: User) => setUser(newUser);
  const handleLogout = () => {
    StorageService.logout();
    setUser(null);
  };

  return (
    <HashRouter>
      <Layout cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/product/:id" element={<ProductDetails onAddToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />} />
          <Route path="/checkout" element={user ? <Checkout cart={cart} user={user} onClearCart={clearCart} /> : <Navigate to="/login" />} />
          
          <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
          
          <Route path="/seller" element={user?.role === 'seller' ? <SellerDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/seller/add" element={user?.role === 'seller' ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/seller/edit/:id" element={user?.role === 'seller' ? <AddProduct /> : <Navigate to="/login" />} />
          
          <Route path="/user" element={user ? <UserDashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;