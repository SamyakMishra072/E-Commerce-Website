const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

// Place a new order (for logged-in users)
router.post('/', protect, createOrder);

// Get current user's orders
router.get('/my', protect, getMyOrders);

// Get all orders (admin only)
router.get('/', protect, admin, getAllOrders);

// Update order status (admin only)
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
