const Product = require('../models/Product');

// @desc    Fetch all products
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// @desc    Fetch single product
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

// @desc    Create product (admin)
const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  const created = await newProduct.save();
  res.status(201).json(created);
};

// @desc    Update product (admin)
const updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

// @desc    Delete product (admin)
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
