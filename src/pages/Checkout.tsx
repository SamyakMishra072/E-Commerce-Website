import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Product, Address } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';

const Checkout: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<(Product & { quantity: number })[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [total, setTotal] = useState(0);

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const { getCartProducts, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [products, userAddresses, cartTotal] = await Promise.all([
          getCartProducts(),
          orderService.getAddresses(user.id),
          getCartTotal()
        ]);

        setCartProducts(products);
        setAddresses(userAddresses);
        setTotal(cartTotal);

        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const savedAddress = await orderService.saveAddress(user.id, newAddress);
      setAddresses([...addresses, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowAddressForm(false);
      setNewAddress({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      toast.success('Address saved successfully');
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress) return;
    setProcessing(true);

    try {
      const response = await orderService.placeOrder({
        orderItems: cartProducts.map(p => ({
          product: p.id,
          qty: p.quantity,
          price: p.price
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online',
        total: total + (total >= 499 ? 0 : 49),
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    navigate('/cart');
    return null;
  }

  const deliveryFee = total >= 499 ? 0 : 49;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ...your existing JSX code remains unchanged... */}

      <button
        onClick={handlePlaceOrder}
        disabled={!selectedAddress || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;
