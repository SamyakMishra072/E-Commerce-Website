// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Shield, Headphones, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { Product, Category } from '../types';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>;

  return (
    <>
      {/* Hero with Blob & Illustration */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-emerald-600 text-white">
        {/* Soft Blob */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 py-24 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl lg:text-7xl font-extrabold leading-tight"
            >
              Shop Everything You Need
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 text-lg lg:text-xl text-blue-100 max-w-xl mx-auto lg:mx-0"
            >
              Discover millions of products from trusted sellers across India.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              {!user ? (
                <>
                  <Link to="/register" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                    Register Now
                  </Link>
                  <Link to="/login" className="px-6 py-3 border-2 border-white rounded-lg text-white font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/products" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg inline-flex items-center hover:scale-105 transition-transform">
                    Shop Now <ArrowRight className="ml-1 w-5 h-5" />
                  </Link>
                  <Link to="/products?sortBy=newest" className="px-6 py-3 border-2 border-white rounded-lg text-white font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Latest Arrivals
                  </Link>
                </>
              )}
            </motion.div>
          </div>
          {/* Hero Illustration */}
          <motion.img
            src="/assets/hero-graphic.svg"
            alt="Hero"
            className="hidden lg:block lg:w-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
      </section>

      {/* Features (micro-interactions) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: '₹499+ Orders' },
            { icon: Shield, title: 'Secure Pay', desc: '100% Protection' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always Online' },
            { icon: ShoppingBag, title: 'Easy Returns', desc: 'Hassle-Free' },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 text-center shadow-xl ring-1 ring-gray-100 transition-transform cursor-pointer"
            >
              <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
          <div className="relative overflow-hidden">
            {/* Simplest: use CSS scroll / or integrate Swiper/Glide for full carousel */}
            <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-2">
              {[
                { name: 'Priya S.', text: 'Fantastic range & quick delivery!', rating: 5 },
                { name: 'Rahul K.', text: 'Amazing deals. Will shop again.', rating: 4 },
                { name: 'Anita M.', text: 'Excellent customer support.', rating: 5 },
              ].map((t, i) => (
                <div key={i} className="min-w-[300px] flex-shrink-0 bg-gray-50 p-6 rounded-2xl shadow-md snap-center">
                  <div className="flex items-center mb-3 justify-center">
                    {Array.from({ length: t.rating }).map((_, i2) => (
                      <Star key={i2} className="w-5 h-5 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">“{t.text}”</p>
                  <p className="font-semibold text-gray-900">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
        <div className="container mx-auto px-4 text-center">
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
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:scale-105 transition-transform inline-flex items-center justify-center"
            >
              Subscribe <ArrowRight className="ml-1 w-5 h-5" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
