import { WishlistItem } from '../types';

const WISHLIST_KEY = 'samyak_wishlist';

class WishlistService {
  async getWishlist(): Promise<WishlistItem[]> {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async addToWishlist(productId: string): Promise<WishlistItem[]> {
    const wishlist = await this.getWishlist();
    const existingItem = wishlist.find(item => item.productId === productId);
    
    if (!existingItem) {
      wishlist.push({
        productId,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
    
    return wishlist;
  }

  async removeFromWishlist(productId: string): Promise<WishlistItem[]> {
    const wishlist = await this.getWishlist();
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    return updatedWishlist;
  }

  async clearWishlist(): Promise<void> {
    localStorage.removeItem(WISHLIST_KEY);
  }
}
// src/services/wishlistService.ts
const WL_URL = `${import.meta.env.VITE_API_BASE}/wishlist`;
export async function getWishlist(token: string) {
  const res = await fetch(WL_URL, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to load wishlist');
  return res.json();
}
export async function addToWishlist(token: string, productId: string) {
  const res = await fetch(WL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error('Add to wishlist failed');
  return res.json();
}
export async function removeFromWishlist(token: string, productId: string) {
  const res = await fetch(`${WL_URL}/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Remove from wishlist failed');
  return res.json();
}

export const wishlistService = new WishlistService();