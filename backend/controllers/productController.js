const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const { name, price, description, imageUrl, category, stock } = req.body;
  if (!name || price == null || !description || !imageUrl || !category || stock == null) {
    return res.status(400).json({ message: 'All product fields are required' });
  }

  const product = await Product.create({ name, price, description, imageUrl, category, stock });
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const updates = req.body;
  Object.assign(product, updates);
  await product.save();
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
};
