// src/components/common/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount(getCartCount());
  }, [getCartCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setIsSearching(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      setIsSearching(true);
      try {
        const results = await productService.searchProducts(query);
        setSearchResults(results.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* main row */}
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Samyak</span>
          </Link>

          {/* search */}
          <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands and more"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow mt-1 overflow-y-auto max-h-80 z-50">
                {isSearching && <div className="p-4 text-center text-gray-500">Searching...</div>}
                {searchResults.map(prod => (
                  <Link
                    key={prod.id}
                    to={`/products/${prod.id}`}
                    className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
                    onClick={() => { setSearchResults([]); setSearchQuery(''); }}
                  >
                    <img src={prod.images[0]} alt={prod.name}
                         className="w-12 h-12 object-cover rounded-lg mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium truncate">{prod.name}</h4>
                      <p className="text-sm text-gray-500">₹{prod.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* desktop actions */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow py-2 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}>
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}>
                      My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50"
                            onClick={() => setShowUserMenu(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                      className="px-3 py-1 border rounded hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/register"
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
            <Link to="/wishlist" className="relative text-gray-700 hover:text-blue-600">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* mobile menu toggle */}
          <button className="md:hidden text-gray-700"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* categories nav (desktop) */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t">
          <Link to="/products" className="text-sm hover:text-blue-600">All Products</Link>
          <Link to="/products?category=electronics" className="text-sm hover:text-blue-600">Electronics</Link>
          <Link to="/products?category=fashion" className="text-sm hover:text-blue-600">Fashion</Link>
          <Link to="/products?category=home" className="text-sm hover:text-blue-600">Home & Living</Link>
        </nav>
      </div>

      {/* mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">
            {user ? (
              <>
                <p className="font-medium">Hello, {user.name}</p>
                <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="block">My Profile</Link>
                <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="block">My Orders</Link>
                {user.isAdmin && (
                  <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="block">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="block text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setShowMobileMenu(false)} className="block">Login</Link>
                <Link to="/register" onClick={() => setShowMobileMenu(false)} className="block">Register</Link>
              </>
            )}
            <div className="flex items-center space-x-6 pt-4 border-t">
              <Link to="/wishlist" onClick={() => setShowMobileMenu(false)} className="flex items-center">
                <Heart className="w-5 h-5 mr-2" /> Wishlist ({wishlistItems.length})
              </Link>
              <Link to="/cart" onClick={() => setShowMobileMenu(false)} className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" /> Cart ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
);
};

export default Header;
