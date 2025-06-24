import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const Wishlist: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { getWishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const products = await getWishlistProducts();
        setWishlistProducts(products);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemoveFromWishlist = async (product: Product) => {
    try {
      await removeFromWishlist(product.id);
      setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success(`${product.name} removed from wishlist`);
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleMoveToCart = async (product: Product) => {
    try {
      await addToCart(product.id);
      await removeFromWishlist(product.id);
      setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success(`${product.name} moved to cart`);
    } catch (error) {
      toast.error('Failed to move to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="text-gray-600">{wishlistProducts.length} items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    -{product.discount}%
                  </div>
                )}
                
                <button
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="block font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;