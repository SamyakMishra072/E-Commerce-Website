const Wishlist = require('../models/Wishlist');

// @route  GET /api/wishlist
exports.getWishlist = async (req, res) => {
  const wl = await Wishlist.findOne({ user: req.user._id }).populate('items');
  res.json(wl || { items: [] });
};

// @route  POST /api/wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  let wl = await Wishlist.findOne({ user: req.user._id });
  if (!wl) wl = new Wishlist({ user: req.user._id, items: [] });

  if (!wl.items.includes(productId)) wl.items.push(productId);
  await wl.save();
  res.json(wl);
};

// @route  DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res) => {
  let wl = await Wishlist.findOne({ user: req.user._id });
  wl.items = wl.items.filter(id => id.toString() !== req.params.productId);
  await wl.save();
  res.json(wl);
};
