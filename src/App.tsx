import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
  {/* ✅ Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/products" element={<ProductCatalog />} />
  <Route path="/products/:id" element={<ProductDetail />} />

  {/* ✅ Authenticated User Routes */}
  <Route path="/cart" element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  } />

  <Route path="/checkout" element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  } />

  <Route path="/profile" element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } />

  <Route path="/orders" element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  } />

  <Route path="/wishlist" element={
    <ProtectedRoute>
      <Wishlist />
    </ProtectedRoute>
  } />

  {/* ✅ Admin Routes */}
  <Route path="/admin" element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } />
  <Route path="/admin/products" element={
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  } />
  <Route path="/admin/orders" element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  } />
  <Route path="/admin/analytics" element={
    <AdminRoute>
      <AdminAnalytics />
    </AdminRoute>
  } />

  {/* Optional: 404 fallback */}
  <Route path="*" element={<Home />} />
</Routes>

              </main>
              <Footer />
            </div>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#ffffff',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  maxWidth: '400px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
