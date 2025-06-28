import { User } from '../types';

const BASE_URL = `${import.meta.env.VITE_API_BASE}/api/auth`;

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    return data;
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
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
    return data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser(token: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    const data = await res.json();
    return data;
  },
};
