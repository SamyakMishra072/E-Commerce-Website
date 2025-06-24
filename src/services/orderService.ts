import { Order, Address } from '../types';

const ORDERS_KEY = 'samyak_orders';
const ADDRESSES_KEY = 'samyak_addresses';

class OrderService {
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    const orders = await this.getOrders(order.userId);
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(this.getAllOrders().concat(newOrder)));
    
    return newOrder;
  }

  async getOrders(userId: string): Promise<Order[]> {
    const stored = localStorage.getItem(ORDERS_KEY);
    const allOrders = stored ? JSON.parse(stored) : [];
    return allOrders.filter((order: Order) => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const allOrders = await this.getAllOrders();
    const orderIndex = allOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) return null;
    
    allOrders[orderIndex].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    
    return allOrders[orderIndex];
  }

  async getAddresses(userId: string): Promise<Address[]> {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    const allAddresses = stored ? JSON.parse(stored) : [];
    return allAddresses.filter((address: Address) => address.userId === userId);
  }

  async saveAddress(userId: string, address: Omit<Address, 'id'>): Promise<Address> {
    const newAddress: Address = {
      ...address,
      id: `address-${Date.now()}`,
      userId
    };
    
    const addresses = await this.getAddresses(userId);
    addresses.push(newAddress);
    
    const allAddresses = await this.getAllAddresses();
    allAddresses.push(newAddress);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(allAddresses));
    
    return newAddress;
  }

  private async getAllAddresses(): Promise<Address[]> {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
// src/services/orderService.ts
const ORDERS_URL = `${import.meta.env.VITE_API_BASE}/orders`;
export async function placeOrder(token: string, orderItems: any[], totalPrice: number) {
  const res = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderItems, totalPrice }),
  });
  if (!res.ok) throw new Error('Place order failed');
  return res.json();
}
export async function getMyOrders(token: string) {
  const res = await fetch(ORDERS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Load orders failed');
  return res.json();
}

export const orderService = new OrderService();