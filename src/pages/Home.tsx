// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, Star, ShoppingBag, Truck, Shield, Headphones, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, Category } from '../types';
import { productService } from '../services/productService';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [products, cats] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories()
        ]);
        setFeaturedProducts(products);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Shop Everything You Need
            <span className="block text-emerald-300">At Unbeatable Prices</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl mb-8 text-blue-100"
          >
            Discover millions of products from trusted sellers across India
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100"
                >
                  Register Now
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 inline-flex items-center"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/products?sortBy=newest"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 inline-flex items-center"
                >
                  Latest Arrivals
                </Link>
              </>
            )}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹499' },
            { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            { icon: ShoppingBag, title: 'Easy Returns', desc: 'Hassle-free returns' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="bg-gradient-to-r from-blue-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* (the rest of your categories and featured products sections remain unchanged) */}
      {/* … */}
    </div>
  );
};

export default Home;
