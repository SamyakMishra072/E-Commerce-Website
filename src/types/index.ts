export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  deliveryDate?: string;
}

export interface Address {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Category {
  imageUrl: string | undefined;
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  rating: number;
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
}