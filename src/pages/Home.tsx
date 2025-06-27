import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  Shield,
  Headphones,
  ShoppingBag,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { Product, Category } from '../types';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Priya Sharma',
      text: 'Amazing shopping experience! Fast delivery and excellent product quality. Highly recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    },
    {
      name: 'Rahul Kumar',
      text: 'Great deals and fantastic customer service. Love the variety of products available.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    },
    {
      name: 'Anita Mehta',
      text: 'Seamless shopping experience with quick delivery. Will definitely shop again!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories(),
        ]);
        setFeaturedProducts(prods);
        setCategories(cats);
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

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
            src="/assets/hero-graphic.svg"
            alt="Hero graphic"
            className="hidden lg:block lg:w-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>
      </section>

      {/* Category Spotlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Shop by Category</h2>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                className="snap-center flex-shrink-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer"
              >
                <img src={cat.imageUrl} alt={cat.name} className="w-16 h-16 mb-3" />
                <span className="font-semibold text-gray-800">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <div className="text-blue-600 font-bold text-lg">{product.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
          <div className="relative bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl p-12 max-w-3xl mx-auto">
            <div className="text-center">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 shadow-lg"
              />
              <div className="flex justify-center mb-4 text-yellow-400">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg italic text-gray-700 mb-4">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="font-semibold text-gray-900">— {testimonials[currentTestimonial].name}</p>
            </div>
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
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
