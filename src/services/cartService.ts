import { CartItem } from '../types';

const CART_KEY = 'samyak_cart';

class CartService {
  async getCart(): Promise<CartItem[]> {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async addToCart(productId: string, quantity: number): Promise<CartItem[]> {
    const cart = await this.getCart();
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    const cart = await this.getCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  }

  async updateQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    const cart = await this.getCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    
    return cart;
  }

  async clearCart(): Promise<void> {
    localStorage.removeItem(CART_KEY);
  }
}
// src/services/cartService.ts
const CART_URL = `${import.meta.env.VITE_API_BASE}/cart`;
export async function getCart(token: string) {
  const res = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to load cart');
  return res.json();
}
export async function addToCart(token: string, productId: string, qty = 1) {
  const res = await fetch(CART_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, qty }),
  });
  if (!res.ok) throw new Error('Add to cart failed');
  return res.json();
}
export async function removeFromCart(token: string, productId: string) {
  const res = await fetch(`${CART_URL}/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Remove from cart failed');
  return res.json();
}

export const cartService = new CartService();