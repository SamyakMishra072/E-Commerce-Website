import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem, Product } from '../types';
import { wishlistService } from '../services/wishlistService';
import { productService } from '../services/productService';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistProducts: () => Promise<Product[]>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const loadWishlist = async () => {
      const wishlistItems = await wishlistService.getWishlist();
      setItems(wishlistItems);
    };
    loadWishlist();
  }, []);

  const addToWishlist = async (productId: string) => {
    const updatedItems = await wishlistService.addToWishlist(productId);
    setItems(updatedItems);
  };

  const removeFromWishlist = async (productId: string) => {
    const updatedItems = await wishlistService.removeFromWishlist(productId);
    setItems(updatedItems);
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const getWishlistProducts = async (): Promise<Product[]> => {
    const products = await Promise.all(
      items.map(async (item) => {
        const product = await productService.getProduct(item.productId);
        return product;
      })
    );
    return products.filter((product): product is Product => product !== null);
  };

  const clearWishlist = async () => {
    await wishlistService.clearWishlist();
    setItems([]);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistProducts,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};