const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  const created = await newProduct.save();
  res.status(201).json(created);
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
