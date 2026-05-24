const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) return res.status(400).json({ message: 'Shipping address is required' });

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let total = 0;
  const orderItems = cart.items.map(item => {
    total += item.product.price * item.quantity;
    return {
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    };
  });

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total,
    shippingAddress,
  });

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();
    }
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};
