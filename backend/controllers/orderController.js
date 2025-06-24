const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: 'Cash on Delivery',
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = req.body.isDelivered;
    order.deliveredAt = req.body.isDelivered ? Date.now() : null;
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
