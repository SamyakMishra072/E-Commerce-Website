// src/services/authService.ts
import { User } from '../types';

const BASE_URL = `${import.meta.env.VITE_API_BASE}/api/auth`;

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },
};
