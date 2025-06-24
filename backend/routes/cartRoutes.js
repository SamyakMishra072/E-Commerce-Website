const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').get(getCart).post(addToCart);
router.delete('/:productId', removeFromCart);

module.exports = router;
