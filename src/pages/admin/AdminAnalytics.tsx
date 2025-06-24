import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order } from '../../types';
import { orderService } from '../../services/orderService';

const AdminAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const allOrders = await orderService.getAllOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const getFilteredOrders = () => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  };

  const filteredOrders = getFilteredOrders();
  
  const analytics = {
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: filteredOrders.length,
    averageOrderValue: filteredOrders.length > 0 ? 
      filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length : 0,
    conversionRate: 85.2, // Mock data
    topProducts: [
      { name: 'iPhone 15 Pro', sales: 45, revenue: 44955 },
      { name: 'MacBook Air M2', sales: 32, revenue: 38368 },
      { name: 'Sony WH-1000XM5', sales: 78, revenue: 31122 }
    ]
  };

  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOrders = filteredOrders.filter(order => 
      new Date(order.createdAt).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
    };
  }).reverse();

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your store's performance and insights</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Revenue',
              value: `₹${analytics.totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: 'bg-green-500',
              change: '+12.5%'
            },
            {
              title: 'Total Orders',
              value: analytics.totalOrders,
              icon: ShoppingCart,
              color: 'bg-blue-500',
              change: '+8.2%'
            },
            {
              title: 'Average Order Value',
              value: `₹${Math.round(analytics.averageOrderValue).toLocaleString()}`,
              icon: TrendingUp,
              color: 'bg-purple-500',
              change: '+5.1%'
            },
            {
              title: 'Conversion Rate',
              value: `${analytics.conversionRate}%`,
              icon: Users,
              color: 'bg-orange-500',
              change: '+2.3%'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className="text-green-600 text-sm mt-1">{metric.change} vs last period</p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Revenue</h2>
            <div className="space-y-4">
              {dailyRevenue.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">{day.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(10, (day.revenue / Math.max(...dailyRevenue.map(d => d.revenue))) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-900 font-semibold w-20 text-right">
                      ₹{day.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Selling Products</h2>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-gray-600 text-sm">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-green-600 text-sm">#{index + 1} bestseller</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
              const count = filteredOrders.filter(order => order.status === status).length;
              const percentage = filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0;
              
              return (
                <div key={status} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center bg-gray-100">
                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{status}</p>
                  <p className="text-xs text-gray-600">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;