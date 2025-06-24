import { Product, Category, Review, FilterOptions } from '../types';

const PRODUCTS_KEY = 'samyak_products';
const CATEGORIES_KEY = 'samyak_categories';
const REVIEWS_KEY = 'samyak_reviews';

class ProductService {
  private products: Product[] = [];
  private categories: Category[] = [];
  private reviews: Review[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    this.categories = [
      {
        id: 'electronics',
        name: 'Electronics',
        slug: 'electronics',
        image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500',
        subcategories: [
          { id: 'smartphones', name: 'Smartphones', slug: 'smartphones' },
          { id: 'laptops', name: 'Laptops', slug: 'laptops' },
          { id: 'headphones', name: 'Headphones', slug: 'headphones' }
        ]
      },
      {
        id: 'fashion',
        name: 'Fashion',
        slug: 'fashion',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500',
        subcategories: [
          { id: 'mens-clothing', name: "Men's Clothing", slug: 'mens-clothing' },
          { id: 'womens-clothing', name: "Women's Clothing", slug: 'womens-clothing' },
          { id: 'footwear', name: 'Footwear', slug: 'footwear' }
        ]
      },
      {
        id: 'home',
        name: 'Home & Living',
        slug: 'home',
        image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500',
        subcategories: [
          { id: 'furniture', name: 'Furniture', slug: 'furniture' },
          { id: 'decor', name: 'Home Decor', slug: 'decor' },
          { id: 'kitchen', name: 'Kitchen', slug: 'kitchen' }
        ]
      }
    ];

    // Initialize products
    this.products = [
      {
        id: 'smartphone-1',
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with advanced camera system and A17 Pro chip',
        price: 999,
        originalPrice: 1099,
        discount: 9,
        images: [
          'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        category: 'electronics',
        subcategory: 'smartphones',
        brand: 'Apple',
        rating: 4.8,
        reviewCount: 1250,
        stock: 50,
        features: ['6.1-inch Display', '48MP Camera', '5G Enabled', 'Face ID'],
        specifications: {
          'Display': '6.1-inch Super Retina XDR',
          'Processor': 'A17 Pro chip',
          'Storage': '128GB',
          'Camera': '48MP Main + 12MP Ultra Wide'
        },
        tags: ['premium', 'camera', '5g'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'laptop-1',
        name: 'MacBook Air M2',
        description: 'Supercharged by M2 chip for exceptional performance and battery life',
        price: 1199,
        originalPrice: 1299,
        discount: 8,
        images: [
          'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        category: 'electronics',
        subcategory: 'laptops',
        brand: 'Apple',
        rating: 4.7,
        reviewCount: 890,
        stock: 25,
        features: ['M2 Chip', '13.6-inch Display', '18-hour Battery', 'Touch ID'],
        specifications: {
          'Processor': 'Apple M2 8-core CPU',
          'Memory': '8GB Unified Memory',
          'Storage': '256GB SSD',
          'Display': '13.6-inch Liquid Retina'
        },
        tags: ['productivity', 'portable', 'long-battery'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'headphones-1',
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with exceptional sound quality',
        price: 399,
        originalPrice: 449,
        discount: 11,
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        category: 'electronics',
        subcategory: 'headphones',
        brand: 'Sony',
        rating: 4.6,
        reviewCount: 2100,
        stock: 75,
        features: ['Noise Canceling', '30-hour Battery', 'Quick Charge', 'Touch Controls'],
        specifications: {
          'Driver': '30mm',
          'Frequency Response': '4Hz-40kHz',
          'Battery Life': '30 hours',
          'Connectivity': 'Bluetooth 5.2'
        },
        tags: ['audio', 'travel', 'wireless'],
        createdAt: new Date().toISOString()
      }
    ];

    // Save to localStorage
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categories));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.products));
  }

  async getProducts(filters?: Partial<FilterOptions>): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filteredProducts = [...this.products];
    
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          filters.categories!.includes(p.category) || filters.categories!.includes(p.subcategory)
        );
      }
      
      if (filters.brands && filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.brands!.includes(p.brand));
      }
      
      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(p => 
          p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
        );
      }
      
      if (filters.rating) {
        filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
      }
      
      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }
    }
    
    return filteredProducts;
  }

  async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.find(p => p.id === id) || null;
  }

  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const searchTerm = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.products.slice(0, 6);
  }

  async getRelatedProducts(productId: string): Promise<Product[]> {
    const product = await this.getProduct(productId);
    if (!product) return [];
    
    return this.products
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, 4);
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    const stored = localStorage.getItem(REVIEWS_KEY);
    const reviews = stored ? JSON.parse(stored) : [];
    return reviews.filter((r: Review) => r.productId === productId);
  }
}

export const productService = new ProductService();