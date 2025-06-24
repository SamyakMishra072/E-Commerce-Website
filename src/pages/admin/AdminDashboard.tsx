import React, { useState, useEffect } from 'react';
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order, Product } from '../../types';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [orders, products] = await Promise.all([
          orderService.getAllOrders(),
          productService.getProducts()
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          pendingOrders
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Orders',
              value: stats.totalOrders,
              icon: ShoppingCart,
              color: 'bg-blue-500',
              change: '+12%'
            },
            {
              title: 'Total Revenue',
              value: `₹${stats.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: 'bg-green-500',
              change: '+8%'
            },
            {
              title: 'Total Products',
              value: stats.totalProducts,
              icon: Package,
              color: 'bg-purple-500',
              change: '+3%'
            },
            {
              title: 'Pending Orders',
              value: stats.pendingOrders,
              icon: TrendingUp,
              color: 'bg-orange-500',
              change: '-5%'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </a>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/products"
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Package className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-blue-600 font-medium">Manage Products</span>
              </a>
              
              <a
                href="/admin/orders"
                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-green-600 font-medium">View Orders</span>
              </a>
              
              <a
                href="/admin/analytics"
                className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-purple-600 font-medium">Analytics</span>
              </a>
              
              <a
                href="/admin/customers"
                className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Users className="w-8 h-8 text-orange-600 mb-2" />
                <span className="text-orange-600 font-medium">Customers</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;