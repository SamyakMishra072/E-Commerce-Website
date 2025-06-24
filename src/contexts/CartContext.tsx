import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getCartProducts: () => Promise<(Product & { quantity: number })[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = await cartService.getCart();
      setItems(cartItems);
    };
    loadCart();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    const updatedItems = await cartService.addToCart(productId, quantity);
    setItems(updatedItems);
  };

  const removeFromCart = async (productId: string) => {
    const updatedItems = await cartService.removeFromCart(productId);
    setItems(updatedItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const updatedItems = await cartService.updateQuantity(productId, quantity);
    setItems(updatedItems);
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setItems([]);
  };

  const getCartTotal = async (): Promise<number> => {
    const products = await getCartProducts();
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const getCartCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartProducts = async (): Promise<(Product & { quantity: number })[]> => {
    const products = await Promise.all(
      items.map(async (item) => {
        const product = await productService.getProduct(item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
    );
    return products.filter((product): product is Product & { quantity: number } => product !== null);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      getCartProducts
    }}>
      {children}
    </CartContext.Provider>
  );
};