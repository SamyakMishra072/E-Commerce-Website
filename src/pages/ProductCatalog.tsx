import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Product, Category, FilterOptions } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    rating: 0,
    sortBy: 'relevance'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(filters),
          productService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Apply URL params
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy');
        
        if (category) {
          setFilters(prev => ({ ...prev, categories: [category] }));
        }
        
        if (search) {
          const searchResults = await productService.searchProducts(search);
          setProducts(searchResults);
        }
        
        if (sortBy) {
          setFilters(prev => ({ ...prev, sortBy: sortBy as FilterOptions['sortBy'] }));
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  useEffect(() => {
    const applyFilters = async () => {
      if (!loading) {
        const filteredProducts = await productService.getProducts(filters);
        setProducts(filteredProducts);
      }
    };
    applyFilters();
  }, [filters]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = async (product: Product) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      rating: 0,
      sortBy: 'relevance'
    });
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const availableBrands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {searchParams.get('search') ? `Search results for "${searchParams.get('search')}"` : 'All Products'}
            </h1>
            <p className="text-gray-600">{products.length} products found</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors md:hidden"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories?.includes(category.id)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...(filters.categories || []), category.id]
                              : (filters.categories || []).filter(c => c !== category.id);
                            updateFilter('categories', newCategories);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{category.name}</span>
                      </label>
                      {filters.categories?.includes(category.id) && (
                        <div className="ml-6 mt-2 space-y-2">
                          {category.subcategories.map((sub) => (
                            <label key={sub.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.categories?.includes(sub.id)}
                                onChange={(e) => {
                                  const newCategories = e.target.checked
                                    ? [...(filters.categories || []), sub.id]
                                    : (filters.categories || []).filter(c => c !== sub.id);
                                  updateFilter('categories', newCategories);
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-gray-600 text-sm">{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4">Brands</h4>
                <div className="space-y-3">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands?.includes(brand)}
                        onChange={(e) => {
                          const newBrands = e.target.checked
                            ? [...(filters.brands || []), brand]
                            : (filters.brands || []).filter(b => b !== brand);
                          updateFilter('brands', newBrands);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange?.[0] || ''}
                      onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange?.[1] || 100000])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange?.[1] || ''}
                      onChange={(e) => updateFilter('priceRange', [filters.priceRange?.[0] || 0, parseInt(e.target.value) || 100000])}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-900 mb-4">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => updateFilter('rating', rating)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-gray-700">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters and try again
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={`w-full object-cover rounded-t-lg hover:scale-105 transition-transform duration-300 ${
                            viewMode === 'list' ? 'h-48 rounded-l-lg rounded-t-none' : 'h-64'
                          }`}
                        />
                      </Link>
                      
                      {product.discount && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                          -{product.discount}%
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                        <span className="ml-auto text-sm text-gray-500">{product.brand}</span>
                      </div>

                      <Link
                        to={`/products/${product.id}`}
                        className="block font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;