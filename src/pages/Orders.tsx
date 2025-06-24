import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order, Product } from '../types';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderProducts, setOrderProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
  const fetchOrders = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders/my`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    const data = await res.json();
    setOrders(data);
  };
  fetchOrders();
}, []);


  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
          <a
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {orderProducts[order.id]?.map((product, productIndex) => {
                    const orderItem = order.items.find(item => item.productId === product.id);
                    if (!orderItem) return null;
                    
                    return (
                      <div key={product.id} className="flex items-center space-x-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-gray-600 text-sm">{product.brand}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">
                              Qty: {orderItem.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₹{orderItem.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Details (Expandable) */}
                {selectedOrder?.id === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                        <div className="text-gray-600 text-sm space-y-1">
                          <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.addressLine1}</p>
                          {order.shippingAddress.addressLine2 && (
                            <p>{order.shippingAddress.addressLine2}</p>
                          )}
                          <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Payment & Delivery</h4>
                        <div className="text-gray-600 text-sm space-y-2">
                          <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="text-gray-900">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Order Status:</span>
                            <span className={`capitalize font-medium ${
                              order.status === 'delivered' ? 'text-green-600' :
                              order.status === 'cancelled' ? 'text-red-600' :
                              'text-blue-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          {order.deliveryDate && (
                            <div className="flex justify-between">
                              <span>Delivered On:</span>
                              <span className="text-gray-900">
                                {new Date(order.deliveryDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;