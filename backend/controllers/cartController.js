const Cart = require('../models/Cart');
const Product = require('../models/Product');

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

exports.getCart = async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

  const cart = await findOrCreateCart(req.user._id);
  const existingItem = cart.items.find(item => item.product._id.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > product.stock) existingItem.quantity = product.stock;
  } else {
    cart.items.push({ product: product._id, quantity });
  }

  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
  if (quantity > product.stock) return res.status(400).json({ message: 'Quantity exceeds stock' });

  const cart = await findOrCreateCart(req.user._id);
  const item = cart.items.find(item => item.product._id.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await findOrCreateCart(req.user._id);
  cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

exports.clearCart = async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
};
