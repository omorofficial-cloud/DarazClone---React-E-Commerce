import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, Package, Store, Home } from 'lucide-react';
import { StorageService } from '../services/storage';
import { CartItem, User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
  user: UserType | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen flex flex-col bg-bglight text-gray-800">
      {/* Top Bar - Simulated */}
      <div className="bg-gray-100 text-xs py-1 px-4 hidden md:flex justify-between text-gray-600">
        <div>Save More on App</div>
        <div className="flex gap-4">
          <span>Sell on DarazClone</span>
          <span>Customer Care</span>
          <span>Track my Order</span>
          {!user ? (
            <>
              <Link to="/login" className="hover:text-primary">Login</Link>
              <Link to="/login?mode=signup" className="hover:text-primary">Sign Up</Link>
            </>
          ) : (
            <button onClick={onLogout} className="hover:text-primary font-bold uppercase">{user.name} (Logout)</button>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md md:static md:shadow-none">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-1">
            <Store className="w-8 h-8" />
            <span className="hidden md:inline">DarazClone</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl bg-gray-100 rounded-lg overflow-hidden border border-transparent focus-within:border-primary transition-colors">
            <input 
              type="text" 
              placeholder="Search in DarazClone" 
              className="flex-1 bg-transparent px-4 py-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-primary/10 text-primary px-4 hover:bg-primary/20">
              <Search size={20} />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
             {isSeller ? (
                <Link to="/seller" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                    <Store size={24} />
                    <span className="hidden md:inline text-sm font-medium">My Store</span>
                </Link>
             ) : (
                 <Link to="/cart" className="relative text-gray-600 hover:text-primary">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
             )}
            
            <Link to={isSeller ? "/seller" : "/user"} className="text-gray-600 hover:text-primary">
               {user ? <User size={24} /> : <span className="hidden md:inline text-sm">Login</span>}
               {!user && <User size={24} className="md:hidden"/>}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-2 md:px-4 py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white pt-10 pb-6 border-t mt-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Help Center</li>
              <li>How to Buy</li>
              <li>Returns & Refunds</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">DarazClone</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About DarazClone</li>
              <li>Digital Payments</li>
              <li>Daraz Blog</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-lg text-primary mb-4">Download App</h3>
            <div className="flex gap-4">
               <img src="https://picsum.photos/150/50?random=99" alt="App Store" className="h-10 rounded opacity-50 grayscale hover:grayscale-0 cursor-pointer"/>
               <img src="https://picsum.photos/150/50?random=98" alt="Google Play" className="h-10 rounded opacity-50 grayscale hover:grayscale-0 cursor-pointer"/>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Note: This is a frontend demo mimicking Daraz. No real payments are processed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;