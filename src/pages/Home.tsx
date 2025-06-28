import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  Shield,
  Headphones,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-emerald-600 text-white pb-32">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 pt-24 flex flex-col lg:flex-row items-center relative">
          <div className="lg:w-1/2 z-10 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl lg:text-7xl font-extrabold leading-tight"
            >
              Shop Everything You Need
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-lg lg:text-xl text-blue-100 max-w-xl"
            >
              Discover millions of products from trusted sellers across India.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:scale-110 transition-transform"
                  >
                    Register Now
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 border-2 border-white rounded-lg text-white font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/products"
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg inline-flex items-center hover:scale-110 transition-transform"
                  >
                    Shop Now <ArrowRight className="ml-1 w-5 h-5" />
                  </Link>
                  <Link
                    to="/products?sortBy=newest"
                    className="px-6 py-3 border-2 border-white rounded-lg text-white font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Latest Arrivals
                  </Link>
                </>
              )}
            </motion.div>
          </div>
          <motion.img
            className="hidden lg:block lg:w-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: '₹499+ Orders' },
            { icon: Shield, title: 'Secure Payment', desc: '100% Protection' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always Online' },
            { icon: ShoppingBag, title: 'Easy Returns', desc: 'Hassle-Free' },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 text-center shadow-xl ring-1 ring-gray-100 transition-transform cursor-pointer"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Get Exclusive Offers</h3>
          <p className="mb-6">Subscribe to our newsletter and save 10% on your first order.</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg text-gray-800"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              Subscribe <ArrowRight className="ml-1 w-5 h-5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
