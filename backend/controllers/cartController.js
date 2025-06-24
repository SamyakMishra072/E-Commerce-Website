const Cart = require('../models/Cart');

// @route  GET /api/cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
};

// @route  POST /api/cart
exports.addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex(i => i.product.equals(productId));
  if (itemIndex > -1) cart.items[itemIndex].qty += qty;
  else cart.items.push({ product: productId, qty });

  await cart.save();
  res.json(cart);
};

// @route  DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(i => !i.product.equals(req.params.productId));
  await cart.save();
  res.json(cart);
};
